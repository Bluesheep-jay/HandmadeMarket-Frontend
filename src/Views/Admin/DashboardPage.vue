<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Thống kê chung</div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey">Tổng sản phẩm</div>
            <div class="text-h4">{{ stats.totalProducts }}</div>
            <q-icon
              name="inventory_2"
              size="3rem"
              class="absolute-bottom-right q-mr-md q-mb-md text-orange-3"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey">Tổng đơn hàng</div>
            <div class="text-h4">{{ stats.totalOrders }}</div>
            <q-icon
              name="shopping_cart"
              size="3rem"
              class="absolute-bottom-right q-mr-md q-mb-md text-orange-3"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey">Số lượng người dùng</div>
            <div class="text-h4">{{ stats.totalUsers }}</div>
            <q-icon
              name="people"
              size="3rem"
              class="absolute-bottom-right q-mr-md q-mb-md text-orange-3"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey">Số lượng cửa hàng</div>
            <div class="text-h4">{{ stats.totalShops }}</div>
            <q-icon
              name="store"
              size="3rem"
              class="absolute-bottom-right q-mr-md q-mb-md text-orange-3"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card class="bg-white">
          <q-card-section>
            <div class="text-h6">Thống kê doanh thu (2025)</div>
            <revenue-chart :chart-data="revenueData" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-white">
          <q-card-section>
            <div class="text-h6">Danh mục bán chạy nhất tháng</div>
            <q-list separator>
              <q-item v-for="category in topCategories" :key="category._id">
                <q-item-section>
                  <q-item-label>{{ category.categoryName }}</q-item-label>
                  <q-item-label caption
                    >{{ category.totalQuantitySold }} sản phẩm bán ra</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-badge color="orange-8" text-color="white">
                    {{ category.totalQuantitySold }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="q-mt-md">
      <q-card class="bg-white">
        <q-card-section>
          <div class="text-h6">Đơn hàng hiện tại</div>
        </q-card-section>

        <q-table
          :rows="recentOrders"
          :columns="orderColumns"
          row-key="orderId"
          :pagination="{ rowsPerPage: 5 }"
          flat
          bordered
        >
          <template v-slot:body-cell-orderStatus="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.value)">
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="orange-8"
                @click="viewOrder(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import RevenueChart from "../../components/admin/RevenueChart.vue";
import adminService from "../../services/admin.service";
import orderService from "../../services/order.service";
import categoryService from "../../services/category.service";
import productService from "../../services/product.service";
import usersService from "../../services/users.service";
import shopService from "../../services/shop.service";

const stats = ref({
  totalProducts: 30,
  totalOrders: 13,
  totalUsers: 8,
  totalShops: 12,
});

const revenueData = ref({
  labels: [
    "th1",
    "th2",
    "th3",
    "th4",
    "th5",
    "th6",
    "th7",
    "th8",
    "th9",
    "th10",
    "th11",
    "th12",
  ],
  datasets: [
    {
      label: "Revenue (VND)",
      backgroundColor: "rgba(255, 140, 0, 0.2)",
      borderColor: "#ff8c00",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
});

const topCategories = ref([]);

const orderColumns = [
  { name: "orderNo", label: "Order #", field: "orderNo", align: "left" },
  {
    name: "orderDate",
    label: "Date",
    field: (row) => formatDate(row.orderDate),
    align: "left",
  },
  { name: "userName", label: "Customer", field: "userName", align: "left" },
  { name: "shopName", label: "Shop", field: "shopName", align: "left" },
  {
    name: "totalPrice",
    label: "Total",
    field: (row) => formatCurrency(row.totalPrice),
    align: "right",
  },
  {
    name: "orderStatus",
    label: "Status",
    field: "orderStatus",
    align: "center",
  },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const recentOrders = ref([]);

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString("vi-VN");
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "positive";
    case "Đang chờ xử lý":
      return "warning";
    case "Đã hủy":
      return "negative";
    default:
      return "grey";
  }
};

const viewOrder = (order) => {
  console.log("View order:", order);
  // Implement view order details - navigate to order details page
};

onMounted(async () => {
  try {
    //asign values to revenueData
    const monthlyRevenue = await adminService.getMonthlyRevenueForYear(2025);
    revenueData.value.datasets[0].data = Object.values(monthlyRevenue);

    stats.value.totalProducts = await productService.getTotal()
    stats.value.totalOrders =  await orderService.getTotal();
    stats.value.totalUsers = await usersService.getTotal();
    stats.value.totalShops = await shopService.getTotal();


    const topSellingCategories = await categoryService.getTop5(4, 2025);
    topCategories.value = topSellingCategories;

    const recentOrdersData = await orderService.getAllOrdersWithDetail();
    recentOrders.value = recentOrdersData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
});
</script>

<style lang="scss" scoped>
.dashboard-card {
  position: relative;
  height: 120px;

  .q-card__section {
    height: 100%;
  }
}

.q-page {
  background-color: #f5f5f5;
}
</style>
