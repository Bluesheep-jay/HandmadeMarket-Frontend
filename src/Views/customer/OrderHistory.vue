<template>
  <q-page padding class="page-container">
    <div class="order-history-container">
      <!-- Order Status Tabs -->
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="all" label="Tất cả" />
        <q-tab name="pending_payment" label="Đơn chờ duyệt" />
        <q-tab name="pending_delivery" label="Chờ giao hàng" />
        <q-tab name="shipping" label="Vận chuyển" />
        <q-tab name="completed" label="Hoàn thành" />
        <q-tab name="cancelled" label="Đã hủy" />
        <q-tab name="refund" label="Trả hàng/Hoàn tiền" />
      </q-tabs>

      <q-separator />

      <!-- Order List -->
      <div class="q-mt-md">
        <q-card
          v-for="(order, index) in filteredOrders"
          :key="order.id"
          flat
          bordered
          class="q-mb-md"
        >
          <!-- Shop Header -->
          <q-card-section class="bg-grey-2">
            <div class="row items-center justify-between">
              <div class="row items-center">
                <q-badge color="orange" class="q-mr-sm">Yêu thích</q-badge>
                <div class="text-weight-bold">
                  {{ order.shopName }}
                </div>
              </div>
              <div class="row items-center">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  icon="chat"
                  label="Chat"
                  class="q-mr-sm"
                />
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  icon="storefront"
                  label="Xem Shop"
                />
              </div>
            </div>
          </q-card-section>

          <!-- Order Items -->
          <q-card-section>
            <div
              v-for="(item, index) in order.orderDetails"
              :key="index"
              class="row q-py-md items-center"
            >
              <!-- Product Image -->
              <div class="col-auto">
                <q-img
                  :src="item.imageList[0]"
                  width="80px"
                  height="80px"
                  class="rounded-borders"
                />
              </div>

              <!-- Product Details -->
              <div class="col q-px-md">
                <div class="text-subtitle1 single-line-ellipsis">
                  {{ item.productTitle }}
                </div>
                <div class="text-caption text-grey row">
                  Phân loại hàng:
                  <div
                    class="q-px-sm"
                    v-for="(selection, index) in item.selectedOptions"
                    :key="index"
                  >
                    {{ selection }}
                  </div>
                </div>
                <div class="text-caption">x{{ item.quantity }}</div>
              </div>

              <!-- Price -->
              <div class="col-auto text-right">
                <div class="text-subtitle1 text-orange">
                  {{ formatPrice(item.price) }}
                </div>

                <q-btn
                  v-if="!isReviewed(item.productId) && isOrderCompleted(order)"
                  outline
                  color="primary"
                  label="Đánh giá"
                  @click="openReviewDialog(item)"
                />

                <q-btn
                  v-if="isReviewed(item.productId) && isOrderCompleted(order)"
                  outline
                  color="green"
                  label="Xem đánh giá"
                  @click="viewReview(item)"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Order Footer -->
          <q-card-section>
            <div class="row justify-between items-center">
              <div v-if="isRequestCancellation(order)" class="row items-center">
                <q-icon
                  name="remove_circle"
                  color="red"
                  size="sm"
                  class="q-mr-xs"
                />
                <span class="text-red">{{ getOrderStatusText(order) }}</span>
              </div>
              <div v-else class="row items-center">
                <q-icon
                  name="check_circle"
                  color="green"
                  size="sm"
                  class="q-mr-xs"
                />
                <span class="text-green">{{ getOrderStatusText(order) }}</span>
                <q-btn
                  v-if="isPending(order) && !isOrderPaid(order)"
                  outline
                  color="primary"
                  label="Yêu cầu hủy đơn"
                  @click="requestOrderCancellation(order)"
                  class="q-ml-lg"
                />
                <q-btn
                  v-if="isPending(order) && isOrderPaid(order)"
                  outline
                  color="primary"
                  label="Yêu cầu hủy đơn và hoàn tiền"
                  @click="requestCancellationAndRefund(order)"
                  class="q-ml-lg"
                />
                <q-btn
                  v-if="isOrderCompleted(order)"
                  outline
                  color="primary"
                  label="Yêu cầu hoàn tiền"
                  @click="requestCancellationAndRefund(order)"
                  class="q-ml-lg"
                />
              </div>
              <div class="row items-center">
                <q-btn
                  v-if="isShipping(order)"
                  outline
                  color="primary"
                  label="Đã nhận hàng"
                  @click="confirmOrderReceived(order)"
                  class="q-mr-lg"
                />
                <div>
                  <div class="ship-fee">
                    <div class="row items-center">
                      <span
                        class="q-mr-sm"
                        :class="{ 'text-strike': isOrderPaid(order) }"
                        >Tiền ship:</span
                      >
                      <span
                        class="text-h7 text-orange"
                        :class="{ 'text-strike': isOrderPaid(order) }"
                      >
                        {{ shipmentFee(order) }}</span
                      >
                    </div>
                  </div>
                  <div class="row items-center">
                    <span
                      v-if="isOrderPaid(order)"
                      class="text-green text-bold q-mr-sm"
                    >
                      Đã Thanh toán
                    </span>
                    <span
                      class="q-mr-sm"
                      :class="{ 'text-strike': isOrderPaid(order) }"
                    >
                      Thành tiền:
                    </span>
                    <span
                      class="text-h6 text-orange"
                      :class="{ 'text-strike': isOrderPaid(order) }"
                    >
                      {{ formatPrice(order.totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- Action Buttons -->
          <q-card-section class="q-pt-none">
            <div class="row justify-end q-gutter-sm">
              <q-btn v-if="canBuyAgain(order)" color="orange" label="Mua lại" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- No Orders Message -->
      <div
        v-if="filteredOrders.length === 0"
        class="column items-center q-pa-lg"
      >
        <q-icon name="shopping_bag" size="5rem" color="grey-5" />
        <div class="text-h6 q-mt-md">Không có đơn hàng nào</div>
        <q-btn color="primary" label="Mua sắm ngay" class="q-mt-md" to="/" />
      </div>

      <q-dialog v-model="reviewDialog">
        <q-card class="review-card">
          <q-card-section>
            <div class="text-h6">Viết đánh giá</div>
          </q-card-section>
          <q-card-section class="row">
            <q-img
              :src="selectedItem.imageList[0]"
              width="80px"
              height="80px"
              class="rounded-borders col-4 q-mr-md"
            />
            <div class="col-8">{{ selectedItem.productTitle }}</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="reviewContent"
              label="Nhận xét của bạn"
              type="textarea"
            />
            <q-rating v-model="reviewRating" size="2em" color="yellow" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" v-close-popup />
            <q-btn color="primary" label="Gửi" @click="submitReview" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="viewReviewDialog">
        <q-card class="review-card">
          <q-card-section>
            <div class="text-h6">Viết đánh giá</div>
          </q-card-section>
          <q-card-section class="row">
            <q-img
              :src="selectedItem.imageList[0]"
              width="80px"
              height="80px"
              class="rounded-borders col-4 q-mr-md"
            />
            <div class="col-8">
              {{ selectedItem.productTitle }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="selectedViewReviewProduct.reviewComment"
              label="Nhận xét của bạn"
              type="textarea"
            />
            <q-rating
              v-model="selectedViewReviewProduct.reviewRating"
              size="2em"
              color="yellow"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Đóng" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import orderService from "../../services/order.service";
import orderStatusService from "../../services/orderStatus.service";
import shopService from "../../services/shop.service";
import reviewService from "../../services/review.service";

const userId = localStorage.getItem("userId");
const PENDING_STATUS = "67ca8c309504452e420327c0";
const SHIPPING_STATUS = "67d8cd19347ab249ebe8b159";
const COMPLETED_STATUS = "67d8cd2a347ab249ebe8b15b";
const REQUEST_CANCELLATION_STATUS = "67dbfb9009072401a615967b";
const REQUEST_REFUND = "67dc4f3885209d804a44c23b";
const REFUNDED = "67dc4f4f85209d804a44c23d";
const VNPAY_PAYMENT_METHOD = "67ca83dce899cd4bd9882dfd";

const orders = ref([]);
const orderStatuses = ref([]);
const productList = ref([]);
const shopList = ref([]);
const activeTab = ref("all");

const reviewDialog = ref(false);
const viewReviewDialog = ref(false);
const reviewContent = ref("");
const reviewRating = ref(0);
const selectedItem = ref(null);
const review = ref({
  reviewRating: 0,
  reviewComment: "",
  reviewUserId: 0,
  reviewProductId: 0,
  reviewCreatedDate: null,
  reviewUpdatedDate: null,
});
const selectedViewReviewProduct = ref();

const reviewList = ref([]);

onBeforeMount(async () => {
  try {
    orders.value = await orderService.getAllOrderWithProductByUserId(userId);
    orderStatuses.value = await orderStatusService.getAll();

    reviewList.value = await reviewService.getReviewByUserId(userId);

    // console.log(reviewList.value);

    for (const order of orders.value) {
      const res = await shopService.getById(order.orderShopId);
      shopList.value.push(res);
    }

    orders.value = orders.value.map((order) => {
      const shop = shopList.value.find((shop) => shop.id === order.orderShopId);

      return {
        ...order,
        shopName: shop ? shop.shopName : "Unknown",
      };
    });
  } catch (error) {
    console.error(error);
  }
});

const openReviewDialog = (item) => {
  selectedItem.value = item;
  reviewDialog.value = true;
};

const requestOrderCancellation = async (order) => {
  order.orderStatusId = REQUEST_CANCELLATION_STATUS;
  try {
    const res = await orderService.updateStatus(
      order.id,
      REQUEST_CANCELLATION_STATUS
    );
  } catch (error) {
    console.error(error);
  }
};

const requestCancellationAndRefund = async (order) => {
  order.orderStatusId = REQUEST_REFUND;
  try {
    const res = await orderService.updateStatus(order.id, REQUEST_REFUND);
  } catch (error) {
    console.error(error);
  }
};

const confirmOrderReceived = async (order) => {
  order.orderStatusId = COMPLETED_STATUS;
  try {
    const res = await orderService.updateStatus(order.id, COMPLETED_STATUS);
  } catch (error) {
    console.error(error);
  }
};

const submitReview = async () => {
  try {
    review.value.reviewRating = reviewRating.value;
    review.value.reviewComment = reviewContent.value;
    review.value.reviewUserId = userId;
    review.value.reviewProductId = selectedItem.value.productId;

    const now = new Date();
    now.setHours(now.getHours() + 7);
    review.value.reviewCreatedDate = now.toISOString();
    review.value.reviewUpdatedDate = now.toISOString();

    await reviewService.addReview(review.value);
    reviewList.value.push({ ...review.value });
    reviewContent.value = "";
    reviewRating.value = 0;

    reviewDialog.value = false;
  } catch (error) {
    console.error("Lỗi khi gửi đánh giá:", error);
  }
};

const isReviewed = (productId) => {
  return reviewList.value.some(
    (review) => review.reviewProductId === productId
  );
};

const viewReview = (item) => {
  selectedItem.value = item;
  viewReviewDialog.value = true;

  for (const review of reviewList.value) {
    if (item.productId === review.reviewProductId) {
      selectedViewReviewProduct.value = review;
    }
  }
};

const isPending = (order) => {
  return order.orderStatusId === PENDING_STATUS;
};

const isShipping = (order) => {
  return order.orderStatusId === SHIPPING_STATUS;
};

const isOrderCompleted = (order) => {
  return order.orderStatusId === COMPLETED_STATUS;
};

const isRequestCancellation = (order) => {
  return order.orderStatusId === REQUEST_CANCELLATION_STATUS;
};

const isOrderPaid = (order) => {
  return order.orderPaymentMethodId === VNPAY_PAYMENT_METHOD;
};
// Filter orders based on active tab
const filteredOrders = computed(() => {
  if (activeTab.value === "all") {
    return orders.value;
  }

  // Map tab names to status IDs - replace with your actual mapping
  const statusMapping = {
    pending_payment: "67ca8c309504452e420327c0",
    shipping: "67d8cd19347ab249ebe8b159",
    pending_delivery: "67d8ccfc347ab249ebe8b157",
    completed: "67d8cd2a347ab249ebe8b15b",
  };

  return orders.value.filter(
    (order) => order.orderStatusId === statusMapping[activeTab.value]
  );
});

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

const shipmentFee = (order) => {
  const totalSubPrice = order.orderDetails.reduce((sum, detail) => {
    return sum + detail.price * detail.quantity;
  }, 0);
  const shipmentFee = order.totalPrice - totalSubPrice;
  return formatPrice(shipmentFee);
};

const getOrderStatus = (order) => {
  return (
    orderStatuses.value.find((status) => status.id === order.orderStatusId) ||
    {}
  );
};

const getOrderStatusText = (order) => {
  const status = getOrderStatus(order);
  return status.statusName || "Không xác định";
};

const canBuyAgain = (order) => {
  return isOrderCompleted(order);
};
</script>

<style scoped>
.page-container {
  padding: 10px 50px;
}

.single-line-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.review-card {
  width: 400px;
}

.ship-fee {
  display: flex;
  justify-content: right;
}
</style>
