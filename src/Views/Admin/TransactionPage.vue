<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Quản lý giao dịch</div>
      <div>
        <q-btn
          color="orange-8"
          icon="download"
          label="Export"
          class="q-mr-sm"
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
              placeholder="Search transactions..."
              clearable
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="cardTypeFilter"
              :options="cardTypeOptions"
              dense
              outlined
              label="Card Type"
              emit-value
              map-options
              clearable
            />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="bankFilter"
              :options="bankOptions"
              dense
              outlined
              label="Bank"
              emit-value
              map-options
              clearable
            />
          </div>
        </div>

        <q-table
          :rows="filteredTransactions"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body-cell-transactionAmount="props">
            <q-td :props="props">
              {{ formatCurrency(props.value) }}
            </q-td>
          </template>

          <template v-slot:body-cell-transactionCreatedAt="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
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
                @click="viewTransaction(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="print"
                color="grey"
                @click="printTransaction(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Transaction Details Dialog -->
    <q-dialog v-model="transactionDetailsDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Transaction Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedTransaction">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Transaction Number</q-item-label>
                <q-item-label>{{
                  selectedTransaction.transactionNo
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Amount</q-item-label>
                <q-item-label class="text-weight-bold">{{
                  formatCurrency(selectedTransaction.transactionAmount)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Date</q-item-label>
                <q-item-label>{{
                  formatDate(selectedTransaction.transactionCreatedAt)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Card Type</q-item-label>
                <q-item-label>{{ selectedTransaction.cardType }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Bank</q-item-label>
                <q-item-label>{{
                  selectedTransaction.transactionBankCode
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Order ID</q-item-label>
                <q-item-label>{{ selectedTransaction.orderId }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>User ID</q-item-label>
                <q-item-label>{{
                  selectedTransaction.transactionUserId
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Shop ID</q-item-label>
                <q-item-label>{{
                  selectedTransaction.transactionShopId
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-mt-md">
            <q-btn
              color="orange-8"
              label="Print Receipt"
              icon="print"
              @click="printTransaction(selectedTransaction)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Filter Dialog -->
    <q-dialog v-model="filterDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Filter Transactions</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="cardTypeFilter"
            :options="cardTypeOptions"
            label="Card Type"
            outlined
            emit-value
            map-options
            clearable
            class="q-mb-md"
          />

          <q-select
            v-model="bankFilter"
            :options="bankOptions"
            label="Bank"
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

          <div class="row q-col-gutter-sm q-mt-md">
            <div class="col-6">
              <q-input
                v-model="amountRange.min"
                outlined
                label="Min Amount"
                type="number"
              />
            </div>

            <div class="col-6">
              <q-input
                v-model="amountRange.max"
                outlined
                label="Max Amount"
                type="number"
              />
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
import transactionService from "../../services/transaction.service";

const transactions = ref([]);

const columns = [
  {
    name: "transactionNo",
    label: "Transaction #",
    field: "transactionNo",
    align: "left",
    sortable: true,
  },
  {
    name: "transactionAmount",
    label: "Amount",
    field: "transactionAmount",
    align: "right",
    sortable: true,
  },
  {
    name: "transactionCreatedAt",
    label: "Date",
    field: "transactionCreatedAt",
    align: "left",
    sortable: true,
  },
  {
    name: "cardType",
    label: "Card Type",
    field: "cardType",
    align: "left",
    sortable: true,
  },
  {
    name: "transactionBankCode",
    label: "Bank",
    field: "transactionBankCode",
    align: "left",
    sortable: true,
  },
  { name: "orderId", label: "Order ID", field: "orderId", align: "left" },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const cardTypeOptions = [
  { label: "ATM", value: "ATM" },
  { label: "Credit Card", value: "CREDIT" },
  { label: "E-Wallet", value: "EWALLET" },
];

const bankOptions = [
  { label: "NCB", value: "NCB" },
  { label: "Vietcombank", value: "VCB" },
  { label: "Techcombank", value: "TCB" },
];

const filter = ref("");
const cardTypeFilter = ref(null);
const bankFilter = ref(null);
const dateRange = ref({
  from: "",
  to: "",
});
const amountRange = ref({
  min: null,
  max: null,
});
const loading = ref(false);
const pagination = ref({
  sortBy: "transactionCreatedAt",
  descending: true,
  page: 1,
  rowsPerPage: 10,
});
const transactionDetailsDialog = ref(false);
const selectedTransaction = ref(null);
const filterDialog = ref(false);

const filteredTransactions = computed(() => {
  let result = [...transactions.value];

  if (filter.value) {
    const searchTerm = filter.value.toLowerCase();
    result = result.filter(
      (transaction) =>
        transaction.transactionNo.toLowerCase().includes(searchTerm) ||
        transaction.orderId.toLowerCase().includes(searchTerm)
    );
  }

  if (cardTypeFilter.value) {
    result = result.filter(
      (transaction) => transaction.cardType === cardTypeFilter.value
    );
  }

  if (bankFilter.value) {
    result = result.filter(
      (transaction) => transaction.transactionBankCode === bankFilter.value
    );
  }

  if (dateRange.value.from && dateRange.value.to) {
    const fromDate = new Date(dateRange.value.from).getTime() / 1000;
    const toDate = new Date(dateRange.value.to).getTime() / 1000;
    result = result.filter(
      (transaction) =>
        transaction.transactionCreatedAt >= fromDate &&
        transaction.transactionCreatedAt <= toDate
    );
  }

  if (amountRange.value.min !== null) {
    result = result.filter(
      (transaction) => transaction.transactionAmount >= amountRange.value.min
    );
  }

  if (amountRange.value.max !== null) {
    result = result.filter(
      (transaction) => transaction.transactionAmount <= amountRange.value.max
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

const refreshData = async () => {
  loading.value = true;
  try {
    const transactionsData = await transactionService.getAll();
    transactions.value = transactionsData;
  } catch (error) {
    console.error("Error fetching transactions:", error);
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

const viewTransaction = (transaction) => {
  selectedTransaction.value = transaction;
  transactionDetailsDialog.value = true;
};

const printTransaction = (transaction) => {
  console.log("Print transaction:", transaction);
  // Implement print transaction functionality
};

const resetFilters = () => {
  cardTypeFilter.value = null;
  bankFilter.value = null;
  dateRange.value = { from: "", to: "" };
  amountRange.value = { min: null, max: null };
};

const applyFilters = () => {
  filterDialog.value = false;
  // The computed filteredTransactions will automatically update
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
