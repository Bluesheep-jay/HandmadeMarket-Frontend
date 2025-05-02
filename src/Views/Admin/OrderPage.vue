<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Orders Management</div>
      <div>
        <q-btn
          color="orange-8"
          icon="refresh"
          label="Refresh"
          class="q-mr-sm"
          @click="refreshData"
        />
        <q-btn
          color="black"
          icon="filter_alt"
          label="Filters"
          @click="filterDialog = true"
        />
      </div>
    </div>

    <q-card class="bg-white">
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filter"
              dense
              outlined
              placeholder="Search orders..."
              clearable
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              dense
              outlined
              label="Status"
              emit-value
              map-options
              clearable
            />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="shopFilter"
              :options="shopOptions"
              dense
              outlined
              label="Shop"
              emit-value
              map-options
              clearable
            />
          </div>
        </div>

        <q-table
          :rows="filteredOrders"
          :columns="columns"
          row-key="orderId"
          :pagination="pagination"
          :loading="loading"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body-cell-orderDate="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-totalPrice="props">
            <q-td :props="props">
              {{ formatCurrency(props.value) }}
            </q-td>
          </template>

          <template v-slot:body-cell-orderStatus="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.value)">
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="orange-8"
                @click="viewOrder(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="blue"
                @click="editOrder(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="print"
                color="grey"
                @click="printOrder(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Order Details Dialog -->
    <q-dialog v-model="orderDetailsDialog" maximized>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Order Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedOrder">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1 q-mb-sm">Order Information</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-6">
                      <div class="text-caption text-grey">Order Number</div>
                      <div>{{ selectedOrder.orderNo || "N/A" }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey">Order Date</div>
                      <div>{{ selectedOrder.orderDate }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey">Status</div>
                      <div>
                        <q-badge
                          :color="getStatusColor(selectedOrder.orderStatus)"
                        >
                          {{ selectedOrder.orderStatus }}
                        </q-badge>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey">Total Amount</div>
                      <div class="text-weight-bold">
                        {{ formatCurrency(selectedOrder.totalPrice) }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1 q-mb-sm">Customer Information</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-6">
                      <div class="text-caption text-grey">Customer Name</div>
                      <div>{{ selectedOrder.userName }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey">Customer ID</div>
                      <div>{{ selectedOrder.userId }}</div>
                    </div>
                    <div class="col-12">
                      <div class="text-caption text-grey">Shop</div>
                      <div>{{ selectedOrder.shopName }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Order Items would go here in a real implementation -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1">Order Items</div>
                <div class="text-grey">
                  Order items would be displayed here in a real implementation.
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Order Actions -->
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1">Order Actions</div>
                  <div class="row q-col-gutter-sm q-mt-sm">
                    <div class="col-auto">
                      <q-btn
                        color="orange-8"
                        label="Update Status"
                        icon="update"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn color="blue" label="Send Email" icon="email" />
                    </div>
                    <div class="col-auto">
                      <q-btn color="grey" label="Print Invoice" icon="print" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Filter Dialog -->
    <q-dialog v-model="filterDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Filter Orders</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            label="Status"
            outlined
            emit-value
            map-options
            clearable
            class="q-mb-md"
          />

          <q-select
            v-model="shopFilter"
            :options="shopOptions"
            label="Shop"
            outlined
            emit-value
            map-options
            clearable
            class="q-mb-md"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model="dateRange.from"
                outlined
                label="From Date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="dateRange.from">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input
                v-model="dateRange.to"
                outlined
                label="To Date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="dateRange.to">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Reset" color="grey" @click="resetFilters" />
          <q-btn flat label="Apply" color="orange-8" @click="applyFilters" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import orderService from "../../services/order.service";

const orders = ref([]);

const columns = [
  {
    name: "orderNo",
    label: "Order #",
    field: (row) => row.orderNo || "N/A",
    align: "left",
    sortable: true,
  },
  {
    name: "orderDate",
    label: "Date",
    field: "orderDate",
    align: "left",
    sortable: true,
  },
  {
    name: "userName",
    label: "Customer",
    field: "orderUserId",
    align: "left",
    sortable: true,
  },
  {
    name: "shopName",
    label: "Shop",
    field: "orderShopId",
    align: "left",
    sortable: true,
  },
  {
    name: "totalPrice",
    label: "Total",
    field: "totalPrice",
    align: "right",
    sortable: true,
  },
  {
    name: "orderStatus",
    label: "Status",
    field: "orderStatus",
    align: "center",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const statusOptions = [
  { label: "Pending", value: "Đang chờ xử lý" },
  { label: "Completed", value: "Hoàn thành" },
  { label: "Cancelled", value: "Đã hủy" },
];

const shopOptions = [
  { label: "Ngọc Bích Jewelry", value: "67c20766eceae36f6d75220b" },
  { label: "Hồng Ngọc Jewelry", value: "67c207a6eceae36f6d752214" },
  { label: "Nến nhà Mel", value: "67dd871228d8844aa6763686" },
];

const filter = ref("");
const statusFilter = ref(null);
const shopFilter = ref(null);
const dateRange = ref({
  from: "",
  to: "",
});
const loading = ref(false);
const pagination = ref({
  sortBy: "orderDate",
  descending: true,
  page: 1,
  rowsPerPage: 10,
});
const orderDetailsDialog = ref(false);
const selectedOrder = ref(null);
const filterDialog = ref(false);

const filteredOrders = computed(() => {
  let result = [...orders.value];

  if (filter.value) {
    const searchTerm = filter.value.toLowerCase();
    result = result.filter(
      (order) =>
        (order.orderNo && order.orderNo.toLowerCase().includes(searchTerm)) ||
        order.userName.toLowerCase().includes(searchTerm) ||
        order.shopName.toLowerCase().includes(searchTerm)
    );
  }

  if (statusFilter.value) {
    result = result.filter((order) => order.orderStatus === statusFilter.value);
  }

  if (shopFilter.value) {
    result = result.filter((order) => order.shopId === shopFilter.value);
  }

  if (dateRange.value.from && dateRange.value.to) {
    const fromDate = new Date(dateRange.value.from).getTime() / 1000;
    const toDate = new Date(dateRange.value.to).getTime() / 1000;
    result = result.filter(
      (order) => order.orderDate >= fromDate && order.orderDate <= toDate
    );
  }

  return result;
});

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

const refreshData = async () => {
  loading.value = true;
  try {
    const ordersData = await orderService.getAll();
    orders.value = ordersData;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};


const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  // In a real app, fetch data from API with pagination params
  refreshData();
};

const viewOrder = (order) => {
  selectedOrder.value = order;
  orderDetailsDialog.value = true;
};

const editOrder = (order) => {
  console.log("Edit order:", order);
};

const printOrder = (order) => {
  console.log("Print order:", order);
  // Implement print order functionality
};

const resetFilters = () => {
  statusFilter.value = null;
  shopFilter.value = null;
  dateRange.value = { from: "", to: "" };
};

const applyFilters = () => {
  filterDialog.value = false;
  // The computed filteredOrders will automatically update
};

onMounted(() => {
  refreshData();
});
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #f5f5f5;
}
</style>
