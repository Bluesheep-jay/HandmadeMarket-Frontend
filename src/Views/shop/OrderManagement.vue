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
        <q-tab name="pending_payment" label="Đơn chưa duyệt" />
        <q-tab name="pending_delivery" label="Chờ giao hàng" />
        <q-tab name="shipping" label="Đang vận chuyển" />
        <q-tab name="completed" label="Hoàn thành" />
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
                <div class="text-weight-bold">
                  {{ order.userName }}
                </div>
              </div>
              <div class="row items-center">
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  icon="chat"
                  label="Nhắn tin"
                  class="q-mr-sm"
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
                  {{ formatPrice(item.price)}}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Order Footer -->
          <q-card-section>
            <div class="row justify-between items-center">
              <div class="row items-center">
                <q-icon
                  name="check_circle"
                  color="green"
                  size="sm"
                  class="q-mr-xs"
                />
                <span class="text-green">{{ getOrderStatusText(order) }}</span>
              </div>
              <div>
                <div class="row items-center">
                  <span
                    v-if="isOrderPaid(order.id)"
                    class="text-green text-bold q-mr-sm"
                  >
                    Đã Thanh toán
                  </span>
                  <span
                    class="q-mr-sm"
                    :class="{ 'text-strike': isOrderPaid(order.id) }"
                  >
                    Thành tiền:
                  </span>
                  <span
                    class="text-h6 text-orange"
                    :class="{ 'text-strike': isOrderPaid(order.id) }"
                  >
                    {{ formatPrice(getTotalPrice(order.orderDetails)) }}
                  </span>
                </div>
                <q-btn
                  v-if="isOrderPending(order) && !isPendingShipment(order)"
                  outline
                  color="green"
                  label="Duyệt đơn"
                  @click="approveOrder(order)"
                />
                <q-btn
                  v-if="!isOrderPending(order) && isPendingShipment(order)"
                  outline
                  color="green"
                  label="Bắt đầu vận chuyển"
                  @click="startShipping(order)"
                />
              </div>
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import orderService from "../../services/order.service";
import orderStatusService from "../../services/orderStatus.service";
import shopService from "../../services/shop.service";
import reviewService from "../../services/review.service";
import transactionService from "../../services/transaction.service";
import usersService from "../../services/users.service";

const userId = localStorage.getItem("userId");
const shopId = localStorage.getItem("shopId");

const PENDING_STATUS = "67ca8c309504452e420327c0";
const PENDING_SHIPMENT_STATUS = "67d8ccfc347ab249ebe8b157";
const SHIPPING_STATUS = "67d8cd19347ab249ebe8b159";
const COMPLETED_STATUS = "67d8cd2a347ab249ebe8b15b";
const REQUEST_CANCELLATION_STATUS = "67dbfb9009072401a615967b";
const CANCELED_STATUS = "67dbfbaa09072401a615967d";
const REQUEST_REFUND = "67dc4f3885209d804a44c23b";
const REFUNDED = "67dc4f4f85209d804a44c23d";
const VNPAY_PAYMENT_METHOD = "67ca83dce899cd4bd9882dfd";

const excludedStatusIds = new Set([
  REQUEST_CANCELLATION_STATUS,
  REQUEST_REFUND,
  CANCELED_STATUS,
  REFUNDED,
]);

const orders = ref([]);
const orderStatuses = ref([]);
const shopList = ref([]);
const userList = ref([]);
const activeTab = ref("all");
const transactionList = ref([]);

onBeforeMount(async () => {
  try {
    orders.value = await orderService.getAllOrderWithProductByShopId(shopId);
    orderStatuses.value = await orderStatusService.getAll();
    transactionList.value = await transactionService.getAllByShopId(shopId);

    orders.value = orders.value.filter(
      (order) => !excludedStatusIds.has(order.orderStatusId)
    );

    for (const order of orders.value) {
      const res = await usersService.getUserById(order.orderUserId);
      userList.value.push(res);
    }

    orders.value = orders.value.map((order) => {
      const user = userList.value.find((user) => user.id === order.orderUserId);

      return {
        ...order,
        userName: user ? user.username : "Unknown",
      };
    });

    console.log(orders.value);
  } catch (error) {
    console.error(error);
  }
});

const approveOrder = async (order) => {
  order.orderStatusId = PENDING_SHIPMENT_STATUS;

  try {
    const res = await orderService.updateStatus(
      order.id,
      PENDING_SHIPMENT_STATUS
    );
  } catch (error) {
    console.error(error);
  }
};

const startShipping = async (order) => {
  order.orderStatusId = SHIPPING_STATUS;

  try {
    const res = await orderService.updateStatus(order.id, SHIPPING_STATUS);
  } catch (error) {
    console.error(error);
  }
};

const isOrderPending = (order) => {
  return order.orderStatusId == PENDING_STATUS;
};

const isPendingShipment = (order) => {
  return order.orderStatusId == PENDING_SHIPMENT_STATUS;
};

const isOrderPaid = (orderId) => {
  return transactionList.value.some(
    (transaction) => transaction.orderId === orderId
  );
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

const getTotalPrice = (detail) => {
  return detail.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
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

.text-strike {
  text-decoration: line-through;
}
</style>
