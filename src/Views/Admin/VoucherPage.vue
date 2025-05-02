<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Quản lý mã giảm giá</div>
      <div>
        <q-btn
          color="orange-8"
          icon="add"
          label="Thêm mã giảm giá"
          class="q-mr-sm"
          @click="openVoucherDialog"
        />
        <q-btn
          color="black"
          icon="refresh"
          label="Làm mới"
          @click="refreshData"
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
              placeholder="Tìm kiếm mã giảm giá..."
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
              label="Trạng thái"
              emit-value
              map-options
              clearable
            />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="creatorTypeFilter"
              :options="creatorTypeOptions"
              dense
              outlined
              label="Loại người tạo"
              emit-value
              map-options
              clearable
            />
          </div>
        </div>

        <q-table
          :rows="filteredVouchers"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body-cell-discountValue="props">
            <q-td :props="props">
              {{ formatCurrency(props.value) }}
            </q-td>
          </template>

          <template v-slot:body-cell-minOrderValue="props">
            <q-td :props="props">
              {{ formatCurrency(props.value) }}
            </q-td>
          </template>

          <template v-slot:body-cell-startDate="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
          <template v-slot:body-cell-endDate="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Thêm mã giảm giá</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newVoucher.code"
            label="Mã giảm giá"
            outlined
            dense
          />
          <q-input
            v-model.number="newVoucher.discountValue"
            label="Giá trị giảm"
            outlined
            dense
            type="number"
          />
          <q-input
            v-model.number="newVoucher.minOrderValue"
            label="Giá trị đơn tối thiểu"
            outlined
            dense
            type="number"
          />
          <q-input
            v-model.number="newVoucher.usageLimit"
            label="Giới hạn sử dụng"
            outlined
            dense
            type="number"
          />

          <q-input
            v-model="newVoucher.startDate"
            label="Ngày bắt đầu"
            outlined
            dense
            type="date"
          />
          <q-input
            v-model="newVoucher.endDate"
            label="Ngày kết thúc"
            outlined
            dense
            type="date"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="negative" @click="closeDialog" />
          <q-btn flat label="Lưu" color="positive" @click="saveVoucher" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import voucherService from "../../services/voucher.service";

const vouchers = ref([]);
const filteredVouchers = ref([]);
const filter = ref("");
const statusFilter = ref(null);
const creatorTypeFilter = ref(null);
const loading = ref(false);
const pagination = ref({ page: 1, rowsPerPage: 10 });
const showDialog = ref(false);

const newVoucher = ref({
  code: "",
  discountValue: 0,
  minOrderValue: 0,
  usageLimit: 0,
  startDate: "",
  endDate: "",
  creatorType: "ADMIN",
  status: "ACTIVE",
  createAt: new Date().getTime(),
});

const statusOptions = [
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Hết hạn", value: "EXPIRED" },
];
const creatorTypeOptions = [
  { label: "Quản trị viên", value: "ADMIN" },
  { label: "Cửa hàng", value: "USER" },
];

const columns = [
  {
    name: "code",
    required: true,
    label: "Mã",
    align: "left",
    field: "code",
    sortable: true,
  },
  {
    name: "discountValue",
    label: "Giá trị giảm",
    align: "right",
    field: "discountValue",
    sortable: true,
  },
  {
    name: "minOrderValue",
    label: "Giá trị đơn tối thiểu",
    align: "right",
    field: "minOrderValue",
    sortable: true,
  },
  {
    name: "usageLimit",
    label: "Số lượng mã",
    align: "right",
    field: "usageLimit",
    sortable: true,
  },
  {
    name: "usedCount",
    label: "Sô lương đã sử dụng",
    align: "right",
    field: "usedCount",
    sortable: true,
  },
  {
    name: "startDate",
    label: "Ngày bắt đầu",
    align: "left",
    field: "startDate",
    sortable: true,
  },
  {
    name: "endDate",
    label: "Ngày kết thúc",
    align: "left",
    field: "endDate",
    sortable: true,
  },
  {
    name: "status",
    label: "Trạng thái",
    align: "left",
    field: "status",
    sortable: true,
  },
];

const loadVouchers = async () => {
  loading.value = true;
  try {
    const response = await voucherService.getAllVouchers();
    vouchers.value = response;
    console.log(vouchers.value);
    applyFilters();
  } catch (error) {
    console.error("Error loading vouchers:", error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  filteredVouchers.value = vouchers.value.filter((voucher) => {
    const matchesFilter = filter.value
      ? voucher.code.toLowerCase().includes(filter.value.toLowerCase())
      : true;
    const matchesStatus = statusFilter.value
      ? voucher.status === statusFilter.value
      : true;
    const matchesCreatorType = creatorTypeFilter.value
      ? voucher.creatorType === creatorTypeFilter.value
      : true;

    return matchesFilter && matchesStatus && matchesCreatorType;
  });
};

const refreshData = async () => {
  await loadVouchers();
};

const onRequest = (props) => {
  pagination.value = props.pagination;
};

const openVoucherDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const saveVoucher = async () => {
  try {
    // Chuyển đổi ngày tháng sang định dạng ISO-8601
    const formattedVoucher = {
      ...newVoucher.value,
      startDate: new Date(newVoucher.value.startDate).toISOString(),
      endDate: new Date(newVoucher.value.endDate).toISOString(),
    };

    await voucherService.addVoucher(formattedVoucher);
    closeDialog();
    refreshData();
  } catch (error) {
    console.error("Error saving voucher:", error);
  }
};

onMounted(() => {
  loadVouchers();
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("vi-VN");
};
</script>
