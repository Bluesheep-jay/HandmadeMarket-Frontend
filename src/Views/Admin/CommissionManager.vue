<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h5">Quản lý lịch sử tỷ lệ hoa hồng</div>
        <q-btn
          color="orange"
          icon="add"
          label="Thêm mới"
          @click="openAddDialog"
        />
      </div>

      <!-- Loading indicator -->
      <div class="text-center q-pa-md" v-if="loading">
        <q-spinner color="orange" size="3em" />
        <div class="q-mt-sm">Đang tải dữ liệu...</div>
      </div>

      <!-- Commission Rate History Table -->
      <q-table
        v-else
        :rows="commissionRateHistories"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        class="commission-table"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="startDate" :props="props">
              {{ formatDate(props.row.startDate) }}
            </q-td>
            <q-td key="endDate" :props="props">
              {{ formatDate(props.row.endDate) }}
            </q-td>
            <q-td key="ratesCount" :props="props">
              {{ props.row.commissionRates.length }}
            </q-td>
            <q-td key="actions" :props="props">
              <div class="row q-gutter-sm justify-center">
                <q-btn
                  flat
                  round
                  color="info"
                  icon="visibility"
                  @click="viewDetails(props.row)"
                  size="sm"
                >
                  <q-tooltip>Xem chi tiết</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(props.row)"
                  size="sm"
                >
                  <q-tooltip>Xóa</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-lg">
            <div class="text-center">
              <q-icon name="history" size="4em" color="grey-5" />
              <div class="text-h6 q-mt-md">Chưa có dữ liệu</div>
              <div class="text-grey">Hãy thêm lịch sử tỷ lệ hoa hồng mới</div>
            </div>
          </div>
        </template>
      </q-table>

      <!-- Add/Edit Dialog -->
      <q-dialog v-model="addDialog" persistent>
        <q-card style="min-width: 700px">
          <q-card-section class="row items-center">
            <div class="text-h6">{{ dialogTitle }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="formData.startDate"
                  label="Ngày bắt đầu *"
                  mask="date"
                  :rules="[(val) => !!val || 'Vui lòng chọn ngày bắt đầu']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="formData.startDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Đóng"
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
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="formData.endDate"
                  label="Ngày kết thúc *"
                  mask="date"
                  :rules="[
                    (val) => !!val || 'Vui lòng chọn ngày kết thúc',
                    (val) =>
                      val >= formData.startDate ||
                      'Ngày kết thúc phải sau ngày bắt đầu',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="formData.endDate"
                          mask="YYYY-MM-DD"
                          :options="dateOptions"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Đóng"
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

            <div class="text-subtitle1 q-mt-md q-mb-sm">Các mức hoa hồng</div>

            <div
              v-for="(rate, index) in formData.commissionRates"
              :key="index"
              class="q-mb-md"
            >
              <div class="row q-col-gutter-md items-center">
                <div class="col-12 col-md-4">
                  <q-input
                    filled
                    v-model.number="rate.minPrice"
                    label="Giá tối thiểu *"
                    type="number"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Vui lòng nhập giá tối thiểu',
                      (val) => val >= 0 || 'Giá không được âm',
                      (val) =>
                        index === 0 ||
                        val > formData.commissionRates[index - 1].maxPrice ||
                        'Giá tối thiểu phải lớn hơn giá tối đa của mức trước',
                    ]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    filled
                    v-model.number="rate.maxPrice"
                    label="Giá tối đa *"
                    type="number"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Vui lòng nhập giá tối đa',
                      (val) =>
                        val >= rate.minPrice ||
                        'Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu',
                    ]"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    filled
                    v-model.number="rate.commissionRate"
                    label="Tỷ lệ hoa hồng (%) *"
                    type="number"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Vui lòng nhập tỷ lệ hoa hồng',
                      (val) =>
                        (val >= 0 && val <= 100) ||
                        'Tỷ lệ hoa hồng phải từ 0-100%',
                    ]"
                  />
                </div>
                <div class="col-12 col-md-1 flex justify-center">
                  <q-btn
                    round
                    flat
                    color="negative"
                    icon="delete"
                    @click="removeRate(index)"
                    :disable="formData.commissionRates.length <= 1"
                  />
                </div>
              </div>
            </div>

            <div class="q-mt-md">
              <q-btn
                color="primary"
                icon="add"
                label="Thêm mức hoa hồng"
                @click="addRate"
                flat
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="grey" v-close-popup />
            <q-btn
              flat
              label="Lưu"
              color="orange"
              @click="saveCommissionRateHistory"
              :loading="saving"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- View Details Dialog -->
      <q-dialog v-model="detailsDialog">
        <q-card style="min-width: 700px">
          <q-card-section class="row items-center">
            <div class="text-h6">Chi tiết tỷ lệ hoa hồng</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section v-if="selectedHistory">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <div class="text-subtitle2">Ngày bắt đầu</div>
                <div>{{ formatDate(selectedHistory.startDate) }}</div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle2">Ngày kết thúc</div>
                <div>{{ formatDate(selectedHistory.endDate) }}</div>
              </div>
            </div>

            <div class="text-subtitle1 q-mb-sm">Các mức hoa hồng</div>

            <q-table
              :rows="selectedHistory.commissionRates"
              :columns="rateColumns"
              row-key="minPrice"
              :pagination="{ rowsPerPage: 0 }"
              hide-bottom
              class="commission-rates-table"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="minPrice" :props="props">
                    {{ formatPrice(props.row.minPrice) }}
                  </q-td>
                  <q-td key="maxPrice" :props="props">
                    {{ formatPrice(props.row.maxPrice) }}
                  </q-td>
                  <q-td key="commissionRate" :props="props">
                    {{ props.row.commissionRate }}%
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Đóng" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Confirmation Dialog -->
      <q-dialog v-model="deleteDialog" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="negative" text-color="white" />
            <span class="q-ml-sm">Xác nhận xóa</span>
          </q-card-section>

          <q-card-section>
            Bạn có chắc chắn muốn xóa lịch sử tỷ lệ hoa hồng này không?
            <div class="text-caption q-mt-sm">
              Thời gian áp dụng:
              {{ selectedHistory ? formatDate(selectedHistory.startDate) : "" }}
              - {{ selectedHistory ? formatDate(selectedHistory.endDate) : "" }}
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="grey" v-close-popup />
            <q-btn
              flat
              label="Xóa"
              color="negative"
              @click="deleteCommissionRateHistory"
              :loading="deleting"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import commissionRateHistoryService from "../../services/commissionRateHistory.service";

const $q = useQuasar();

// Data
const commissionRateHistories = ref([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const addDialog = ref(false);
const detailsDialog = ref(false);
const deleteDialog = ref(false);
const selectedHistory = ref(null);
const dialogTitle = ref("Thêm lịch sử tỷ lệ hoa hồng mới");

// Form data
const formData = ref({
  startDate: "",
  endDate: "",
  commissionRates: [
    {
      minPrice: 0,
      maxPrice: 500000,
      commissionRate: 5,
    },
  ],
});

// Table columns
const columns = [
  {
    name: "startDate",
    required: true,
    label: "Ngày bắt đầu",
    align: "left",
    field: (row) => row.startDate,
    format: (val) => formatDate(val),
    sortable: true,
  },
  {
    name: "endDate",
    required: true,
    label: "Ngày kết thúc",
    align: "left",
    field: (row) => row.endDate,
    format: (val) => formatDate(val),
    sortable: true,
  },
  {
    name: "ratesCount",
    required: true,
    label: "Số mức hoa hồng",
    align: "center",
    field: (row) => row.commissionRates.length,
    sortable: true,
  },
  {
    name: "actions",
    required: true,
    label: "Thao tác",
    align: "center",
    field: "actions",
  },
];

const rateColumns = [
  {
    name: "minPrice",
    required: true,
    label: "Giá tối thiểu",
    align: "left",
    field: "minPrice",
    format: (val) => formatPrice(val),
    sortable: true,
  },
  {
    name: "maxPrice",
    required: true,
    label: "Giá tối đa",
    align: "left",
    field: "maxPrice",
    format: (val) => formatPrice(val),
    sortable: true,
  },
  {
    name: "commissionRate",
    required: true,
    label: "Tỷ lệ hoa hồng",
    align: "center",
    field: "commissionRate",
    format: (val) => `${val}%`,
    sortable: true,
  },
];

// Date options for end date (must be after start date)
const dateOptions = computed(() => {
  return (date) => date >= formData.value.startDate;
});

// Methods
const loadCommissionRateHistories = async () => {
  loading.value = true;
  try {
    commissionRateHistories.value = await commissionRateHistoryService.getAll();
  } catch (error) {
    console.error("Error loading commission rate histories:", error);
    $q.notify({
      color: "negative",
      message: "Không thể tải dữ liệu lịch sử tỷ lệ hoa hồng",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const openAddDialog = () => {
  resetForm();
  dialogTitle.value = "Thêm lịch sử tỷ lệ hoa hồng mới";
  addDialog.value = true;
};

const resetForm = () => {
  formData.value = {
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(
      new Date(new Date().setMonth(new Date().getMonth() + 3))
    ),
    commissionRates: [
      {
        minPrice: 0,
        maxPrice: 500000,
        commissionRate: 5,
      },
    ],
  };
};

const addRate = () => {
  const lastRate =
    formData.value.commissionRates[formData.value.commissionRates.length - 1];
  formData.value.commissionRates.push({
    minPrice: lastRate.maxPrice + 1,
    maxPrice: lastRate.maxPrice * 2,
    commissionRate: lastRate.commissionRate,
  });
};

const removeRate = (index) => {
  if (formData.value.commissionRates.length > 1) {
    formData.value.commissionRates.splice(index, 1);
  }
};

const saveCommissionRateHistory = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }

  saving.value = true;
  try {
    // Convert dates to ISO format
    const payload = {
      startDate: new Date(formData.value.startDate).toISOString(),
      endDate: new Date(formData.value.endDate).toISOString(),
      commissionRates: formData.value.commissionRates,
    };

    await commissionRateHistoryService.addCOmmissionRateHistory(payload);

    $q.notify({
      color: "positive",
      message: "Lịch sử tỷ lệ hoa hồng đã được lưu thành công",
      icon: "check_circle",
    });

    addDialog.value = false;
    await loadCommissionRateHistories();
  } catch (error) {
    console.error("Error saving commission rate history:", error);
    $q.notify({
      color: "negative",
      message: "Không thể lưu lịch sử tỷ lệ hoa hồng",
      icon: "error",
    });
  } finally {
    saving.value = false;
  }
};

const validateForm = () => {
  // Check if dates are valid
  if (!formData.value.startDate || !formData.value.endDate) {
    $q.notify({
      color: "negative",
      message: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
      icon: "warning",
    });
    return false;
  }

  // Check if end date is after start date
  if (formData.value.endDate < formData.value.startDate) {
    $q.notify({
      color: "negative",
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      icon: "warning",
    });
    return false;
  }

  // Check if commission rates are valid
  for (let i = 0; i < formData.value.commissionRates.length; i++) {
    const rate = formData.value.commissionRates[i];

    if (
      rate.minPrice === null ||
      rate.minPrice === "" ||
      rate.maxPrice === null ||
      rate.maxPrice === "" ||
      rate.commissionRate === null ||
      rate.commissionRate === ""
    ) {
      $q.notify({
        color: "negative",
        message: "Vui lòng điền đầy đủ thông tin cho tất cả các mức hoa hồng",
        icon: "warning",
      });
      return false;
    }

    if (
      rate.minPrice < 0 ||
      rate.maxPrice < 0 ||
      rate.commissionRate < 0 ||
      rate.commissionRate > 100
    ) {
      $q.notify({
        color: "negative",
        message: "Giá không được âm và tỷ lệ hoa hồng phải từ 0-100%",
        icon: "warning",
      });
      return false;
    }

    if (rate.maxPrice < rate.minPrice) {
      $q.notify({
        color: "negative",
        message: "Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu",
        icon: "warning",
      });
      return false;
    }

    if (
      i > 0 &&
      rate.minPrice <= formData.value.commissionRates[i - 1].maxPrice
    ) {
      $q.notify({
        color: "negative",
        message: "Giá tối thiểu phải lớn hơn giá tối đa của mức trước",
        icon: "warning",
      });
      return false;
    }
  }

  return true;
};

const viewDetails = (history) => {
  selectedHistory.value = history;
  detailsDialog.value = true;
};

const confirmDelete = (history) => {
  selectedHistory.value = history;
  deleteDialog.value = true;
};

const deleteCommissionRateHistory = async () => {
  if (!selectedHistory.value || !selectedHistory.value.id) {
    return;
  }

  deleting.value = true;
  try {
    // Note: This is a placeholder since the actual delete method is not provided in the service
    // In a real application, you would call the delete method from the service
    // await commissionRateHistoryService.deleteCommissionRateHistory(selectedHistory.value.id);

    // For now, we'll just simulate deletion by removing from the local array
    commissionRateHistories.value = commissionRateHistories.value.filter(
      (history) => history.id !== selectedHistory.value.id
    );

    $q.notify({
      color: "positive",
      message: "Lịch sử tỷ lệ hoa hồng đã được xóa thành công",
      icon: "check_circle",
    });

    deleteDialog.value = false;
    await loadCommissionRateHistories();
  } catch (error) {
    console.error("Error deleting commission rate history:", error);
    $q.notify({
      color: "negative",
      message: "Không thể xóa lịch sử tỷ lệ hoa hồng",
      icon: "error",
    });
  } finally {
    deleting.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

// Lifecycle hooks
onMounted(() => {
  loadCommissionRateHistories();
});
</script>

<style scoped>
.commission-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.commission-rates-table {
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
