<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Quản lý giao dịch</div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Tổng giao dịch</div>
            <div class="text-h4">{{ transactionList.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-orange-7 text-white">
          <q-card-section>
            <div class="text-h6">Tổng doanh thu</div>
            <div class="text-h4">{{ formatPrice(totalRevenue) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Giao dịch hôm nay</div>
            <div class="text-h4">{{ todayTransactions }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-orange-7 text-white">
          <q-card-section>
            <div class="text-h6">Doanh thu hôm nay</div>
            <div class="text-h4">{{ formatPrice(todayRevenue) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filter Section -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.search"
              label="Tìm kiếm"
              outlined
              dense
              clearable
              debounce="300"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.cardType"
              :options="cardTypeOptions"
              label="Loại thẻ"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.bankCode"
              :options="bankCodeOptions"
              label="Ngân hàng"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="dateRangeText"
              label="Khoảng thời gian"
              outlined
              dense
              readonly
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="filters.dateRange"
                      range
                      mask="YYYY-MM-DD"
                      @update:model-value="updateDateRange"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Transaction Table -->
    <q-card>
      <q-card-section>
        <q-table
          :rows="filteredTransactions"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          :filter="filters.search"
          binary-state-sort
          flat
          bordered
        >
          <!-- Custom Header -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-weight-bold"
              >
                {{ col.label }}
              </q-th>
              <q-th auto-width> Chi tiết </q-th>
            </q-tr>
          </template>

          <!-- Custom Body -->
          <template v-slot:body="props">
            <q-tr :props="props" :class="getRowClass(props.row)">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  :icon="
                    props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                  @click="props.expand = !props.expand"
                />
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="q-pa-md">
                  <div class="text-h6 q-mb-md">Chi tiết đơn hàng</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                      <q-list bordered separator>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Mã đơn hàng</q-item-label>
                            <q-item-label>{{ props.row.orderId }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Ngày đặt hàng</q-item-label>
                            <q-item-label>{{
                              formatDate(getOrderDate(props.row.orderId))
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Trạng thái</q-item-label>
                            <q-item-label>
                              <q-badge
                                :color="
                                  getStatusColor(
                                    getOrderStatus(props.row.orderId)
                                  )
                                "
                              >
                                {{ getOrderStatusName(props.row.orderId) }}
                              </q-badge>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="text-subtitle1 q-mb-sm">Sản phẩm</div>
                      <q-list bordered separator>
                        <q-item
                          v-for="item in getOrderItems(props.row.orderId)"
                          :key="item.productId"
                        >
                          <q-item-section avatar>
                            <q-avatar rounded>
                              <img :src="item.imageList[0]" />
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item.productTitle }}</q-item-label>
                            <q-item-label caption>
                              {{ formatPrice(item.price) }} x
                              {{ item.quantity }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            {{ formatPrice(item.price * item.quantity) }}
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>

          <!-- No Data -->
          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-negative">
              <q-icon
                name="sentiment_dissatisfied"
                size="2em"
                class="q-mr-md"
              />
              Không tìm thấy giao dịch nào
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import orderService from "../../services/order.service";
import orderStatusService from "../../services/orderStatus.service";
import transactionService from "../../services/transaction.service";
import usersService from "../../services/users.service";

const userId = localStorage.getItem("userId");
const shopId = localStorage.getItem("shopId");

const userList = ref([]);
const transactionList = ref([]);

const orderList = ref([]);

// Status mapping
const orderStatuses = {
  "67ca8c309504452e420327c0": { name: "Đang chờ xử lý", color: "grey" },
  "67d8ccfc347ab249ebe8b157": { name: "Chờ vận chuyển", color: "blue" },
  "67d8cd19347ab249ebe8b159": { name: "Đang vận chuyển", color: "orange" },
  "67d8cd2a347ab249ebe8b15b": { name: "Hoàn thành", color: "positive" },
};

// Table configuration
const columns = [
  {
    name: "transactionNo",
    label: "Mã giao dịch",
    field: "transactionNo",
    sortable: true,
    align: "left",
  },
  {
    name: "transactionAmount",
    label: "Số tiền",
    field: "transactionAmount",
    sortable: true,
    align: "right",
    format: (val) => formatPrice(val),
  },
  { name: "cardType", label: "Loại thẻ", field: "cardType", sortable: true },
  {
    name: "transactionBankCode",
    label: "Ngân hàng",
    field: "transactionBankCode",
    sortable: true,
  },
  {
    name: "transactionCreatedAt",
    label: "Ngày giao dịch",
    field: "transactionCreatedAt",
    sortable: true,
    format: (val) => formatDate(new Date(val * 1000)),
  },
];

const pagination = ref({
  sortBy: "transactionCreatedAt",
  descending: true,
  page: 1,
  rowsPerPage: 10,
});

const loading = ref(false);
const filters = ref({
  search: "",
  cardType: null,
  bankCode: null,
  dateRange: { from: "", to: "" },
});

const dateRangeText = computed(() =>
  filters.value.dateRange.from && filters.value.dateRange.to
    ? `${filters.value.dateRange.from} → ${filters.value.dateRange.to}`
    : ""
);

const updateDateRange = (newRange) => {
  filters.value.dateRange = newRange;
};

// Options for filters
const cardTypeOptions = [
  { label: "ATM", value: "ATM" },
  { label: "Visa", value: "VISA" },
  { label: "MasterCard", value: "MASTERCARD" },
];

const bankCodeOptions = [
  { label: "NCB", value: "NCB" },
  { label: "Vietcombank", value: "VCB" },
  { label: "Techcombank", value: "TCB" },
];

onBeforeMount(async () => {
  try {
    orderList.value = await orderService.getAllOrderWithProductByShopId(shopId);
    transactionList.value = await transactionService.getAllByShopId(shopId);

    for (const order of orderList.value) {
      const res = await usersService.getUserById(order.orderUserId);
      userList.value.push(res);
    }

    orderList.value = orderList.value.map((order) => {
      const user = userList.value.find((user) => user.id === order.orderUserId);

      return {
        ...order,
        userName: user ? user.username : "Unknown",
      };
    });

  } catch (error) {
    console.error(error);
  }
});
const totalRevenue = computed(() => {
  return transactionList.value.reduce(
    (sum, transaction) => sum + transaction.transactionAmount,
    0
  );
});

const todayTransactions = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime() / 1000;

  return transactionList.value.filter(
    (transaction) => transaction.transactionCreatedAt >= todayTimestamp
  ).length;
});

const todayRevenue = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime() / 1000;

  return transactionList.value
    .filter((transaction) => transaction.transactionCreatedAt >= todayTimestamp)
    .reduce((sum, transaction) => sum + transaction.transactionAmount, 0);
});

const filteredTransactions = computed(() => {
  let result = [...transactionList.value];

  // Filter by card type
  if (filters.value.cardType) {
    result = result.filter((t) => t.cardType === filters.value.cardType);
  }

  // Filter by bank code
  if (filters.value.bankCode) {
    result = result.filter(
      (t) => t.transactionBankCode === filters.value.bankCode
    );
  }

  // Filter by date range
  if (filters.value.dateRange.from && filters.value.dateRange.to) {
    const fromDate = new Date(filters.value.dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    const fromTimestamp = fromDate.getTime() / 1000;

    const toDate = new Date(filters.value.dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    const toTimestamp = toDate.getTime() / 1000;

    result = result.filter(
      (t) =>
        t.transactionCreatedAt >= fromTimestamp &&
        t.transactionCreatedAt <= toTimestamp
    );
  }

  return result;
});

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrderById = (orderId) => {
  return orderList.value.find((order) => order.id === orderId) || null;
};

const getOrderDate = (orderId) => {
  const order = getOrderById(orderId);
  return order ? order.orderDate : null;
};

const getOrderStatus = (orderId) => {
  const order = getOrderById(orderId);
  return order ? order.orderStatusId : null;
};

const getOrderStatusName = (orderId) => {
  const statusId = getOrderStatus(orderId);
  return statusId
    ? orderStatuses[statusId]?.name || "Không xác định"
    : "Không xác định";
};

const getStatusColor = (statusId) => {
  return statusId ? orderStatuses[statusId]?.color || "grey" : "grey";
};

const getShopName = (orderId) => {
  const order = getOrderById(orderId);
  return order ? order.shopName : "Không xác định";
};

const getOrderItems = (orderId) => {
  const order = getOrderById(orderId);
  return order ? order.orderDetails : [];
};

const getRowClass = (row) => {
  const order = getOrderById(row.orderId);
  if (!order) return "";

  switch (order.orderStatusId) {
    case "67d8cd2a347ab249ebe8b15b": // Completed
      return "bg-green-1";
    case "67d8cd19347ab249ebe8b159": // Shipping
      return "bg-orange-1";
    case "67d8ccfc347ab249ebe8b157": // Pending shipping
      return "bg-blue-1";
    default:
      return "";
  }
};

onMounted(() => {
  // Simulate loading data
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.q-table__card {
  box-shadow: none;
}
</style>
