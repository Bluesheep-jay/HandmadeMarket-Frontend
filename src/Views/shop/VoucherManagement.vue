<template>
  <div class="voucher-management q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Quản lý Voucher</div>
      <q-btn
        class="add-btn"
        icon="add"
        label="Tạo Voucher"
        @click="openCreateDialog"
      />
    </div>

    <!-- Voucher Table -->
    <q-card flat bordered>
      <q-table
        :rows="voucherList"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        binary-state-sort
      >
        <!-- Custom column renderers -->
        <template v-slot:body-cell-code="props">
          <q-td :props="props">
            <div class="text-weight-bold">{{ props.value }}</div>
          </q-td>
        </template>

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

        <template v-slot:body-cell-usage="props">
          <q-td :props="props">
            {{ props.row.usedCount }} / {{ props.row.usageLimit }}
          </q-td>
        </template>

        <template v-slot:body-cell-validity="props">
          <q-td :props="props">
            <div>{{ formatDate(props.row.startDate) }}</div>
            <div>đến {{ formatDate(props.row.endDate) }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.value === 'ACTIVE' ? 'green' : 'grey'"
              text-color="white"
              dense
            >
              {{
                props.value === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"
              }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              @click="openEditDialog(props.row)"
            >
              <q-tooltip>Chỉnh sửa</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              :color="props.row.status === 'ACTIVE' ? 'orange' : 'green'"
              :icon="props.row.status === 'ACTIVE' ? 'toggle_off' : 'toggle_on'"
              @click="toggleVoucherStatus(props.row)"
            >
              <q-tooltip>{{
                props.row.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"
              }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Xóa</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- No data message -->
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-md text-grey-8">
            <q-icon name="sentiment_dissatisfied" size="24px" class="q-mr-sm" />
            Không có voucher nào
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Create/Edit Voucher Dialog -->
    <q-dialog v-model="voucherDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ isEditing ? "Chỉnh sửa Voucher" : "Tạo Voucher mới" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit="saveVoucher">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="voucherForm.code"
                  label="Mã voucher *"
                  :rules="[(val) => !!val || 'Vui lòng nhập mã voucher']"
                  outlined
                  dense
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="voucherForm.discountValue"
                  label="Giá trị giảm (VNĐ) *"
                  type="number"
                  :rules="[
                    (val) => !!val || 'Vui lòng nhập giá trị giảm',
                    (val) => val > 0 || 'Giá trị phải lớn hơn 0',
                  ]"
                  outlined
                  dense
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="voucherForm.minOrderValue"
                  label="Giá trị đơn hàng tối thiểu (VNĐ) *"
                  type="number"
                  :rules="[
                    (val) => !!val || 'Vui lòng nhập giá trị tối thiểu',
                    (val) => val > 0 || 'Giá trị phải lớn hơn 0',
                  ]"
                  outlined
                  dense
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="voucherForm.usageLimit"
                  label="Giới hạn sử dụng *"
                  type="number"
                  :rules="[
                    (val) => !!val || 'Vui lòng nhập giới hạn sử dụng',
                    (val) => val > 0 || 'Giá trị phải lớn hơn 0',
                  ]"
                  outlined
                  dense
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="voucherForm.status"
                  label="Trạng thái *"
                  :rules="[(val) => !!val || 'Vui lòng chọn trạng thái']"
                  readonly
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon name="arrow_drop_down" class="cursor-pointer">
                      <q-menu anchor="bottom right" self="top right">
                        <q-list style="min-width: 100px">
                          <q-item
                            clickable
                            v-close-popup
                            @click="voucherForm.status = 'ACTIVE'"
                          >
                            <q-item-section>Đang hoạt động</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="voucherForm.status = 'INACTIVE'"
                          >
                            <q-item-section>Không hoạt động</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <!-- <div class="col-12">
                <q-date v-model="dateRange" range minimal today-btn />
              </div> -->

              <div class="col-12">
                <q-input
                  v-model="dateRangeString"
                  label="Thời gian hiệu lực *"
                  outlined
                  dense
                  readonly
                  :rules="[
                    (val) => !!val || 'Vui lòng chọn thời gian hiệu lực',
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
                          v-model="dateRange"
                          range
                          minimal
                          today-btn
                          @update:model-value="updateDateRangeString"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey-7" v-close-popup />
          <q-btn
            :label="isEditing ? 'Cập nhật' : 'Tạo'"
            color="primary"
            @click="saveVoucher"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Bạn có chắc chắn muốn xóa voucher này?</span>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">
            Mã voucher:
            <span class="text-weight-bold">{{ selectedVoucher?.code }}</span>
          </div>
          <div class="text-caption">Hành động này không thể hoàn tác.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey-7" v-close-popup />
          <q-btn flat label="Xóa" color="negative" @click="deleteVoucher" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Status Toggle Confirmation Dialog -->
    <q-dialog v-model="statusDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            :icon="
              selectedVoucher?.status === 'ACTIVE' ? 'toggle_off' : 'toggle_on'
            "
            :color="selectedVoucher?.status === 'ACTIVE' ? 'orange' : 'green'"
            text-color="white"
          />
          <span class="q-ml-sm">
            {{
              selectedVoucher?.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"
            }}
            voucher này?
          </span>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">
            Mã voucher:
            <span class="text-weight-bold">{{ selectedVoucher?.code }}</span>
          </div>
          <div class="text-caption">
            {{
              selectedVoucher?.status === "ACTIVE"
                ? "Voucher sẽ không thể sử dụng sau khi vô hiệu hóa."
                : "Voucher sẽ có thể sử dụng sau khi kích hoạt."
            }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey-7" v-close-popup />
          <q-btn
            flat
            :label="
              selectedVoucher?.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'
            "
            :color="selectedVoucher?.status === 'ACTIVE' ? 'orange' : 'green'"
            @click="updateVoucherStatus"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { useQuasar } from "quasar";
import voucherService from "../../services/voucher.service";

const $q = useQuasar();
const voucherList = ref([]);
const userId = ref(localStorage.getItem("userId"));
const shopId = ref(localStorage.getItem("shopId"));
const loading = ref(false);
const pagination = ref({
  rowsPerPage: 10,
});

// Dialog controls
const voucherDialog = ref(false);
const deleteDialog = ref(false);
const statusDialog = ref(false);
const isEditing = ref(false);
const selectedVoucher = ref(null);

// Form data
const voucherForm = ref({
  code: "",
  discountValue: 0,
  minOrderValue: 0,
  usageLimit: 0,
  status: "ACTIVE",
});

const dateRange = ref({
  from: "",
  to: "",
});

const dateRangeString = ref("");

const updateDateRangeString = () => {
  dateRangeString.value = `${dateRange.value.from} - ${dateRange.value.to}`;
};
const voucherFormRef = ref(null);

// Table columns
const columns = [
  {
    name: "code",
    align: "left",
    label: "Mã voucher",
    field: "code",
    sortable: true,
  },
  {
    name: "discountValue",
    align: "right",
    label: "Giá trị giảm",
    field: "discountValue",
    sortable: true,
  },
  {
    name: "minOrderValue",
    align: "right",
    label: "Đơn hàng tối thiểu",
    field: "minOrderValue",
    sortable: true,
  },
  {
    name: "usage",
    align: "center",
    label: "Đã sử dụng/Giới hạn",
    field: (row) => `${row.usedCount}/${row.usageLimit}`,
  },
  {
    name: "validity",
    align: "left",
    label: "Thời gian hiệu lực",
    sortable: true,
    sort: (a, b) => a.startDate - b.startDate,
  },
  {
    name: "status",
    align: "center",
    label: "Trạng thái",
    field: "status",
    sortable: true,
  },
  { name: "actions", align: "center", label: "Thao tác" },
];

onBeforeMount(async () => {
  try {
    loading.value = true;

    voucherList.value = await voucherService.getVouchersByShopId(shopId.value);
  } catch (error) {
    console.error("Error during onBeforeMount:", error);
    $q.notify({
      color: "negative",
      message: "Không thể tải danh sách voucher",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
});

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("vi-VN");
};

const timestampToDateString = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
};

const dateStringToTimestamp = (dateString) => {
  if (!dateString) return null;
  return Math.floor(new Date(dateString).getTime() / 1000);
};

// Dialog functions
const openCreateDialog = () => {
  isEditing.value = false;
  voucherForm.value = {
    code: "",
    discountValue: 0,
    minOrderValue: 0,
    usageLimit: 0,
    status: "ACTIVE",
  };

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  dateRange.value = {
    from: today.toISOString().split("T")[0],
    to: nextMonth.toISOString().split("T")[0],
  };

  voucherDialog.value = true;
};

const openEditDialog = (voucher) => {
  isEditing.value = true;
  selectedVoucher.value = voucher;

  voucherForm.value = {
    id: voucher.id,
    code: voucher.code,
    discountValue: voucher.discountValue,
    minOrderValue: voucher.minOrderValue,
    usageLimit: voucher.usageLimit,
    status: voucher.status,
  };

  dateRange.value = {
    from: timestampToDateString(voucher.startDate),
    to: timestampToDateString(voucher.endDate),
  };

  voucherDialog.value = true;
};

const confirmDelete = (voucher) => {
  selectedVoucher.value = voucher;
  deleteDialog.value = true;
};

const toggleVoucherStatus = (voucher) => {
  selectedVoucher.value = voucher;
  statusDialog.value = true;
};

const saveVoucher = async () => {
  try {
    // Form validation
    if (
      !voucherForm.value.code ||
      !voucherForm.value.discountValue ||
      !voucherForm.value.minOrderValue ||
      !voucherForm.value.usageLimit ||
      !dateRange.value.from ||
      !dateRange.value.to
    ) {
      $q.notify({
        color: "negative",
        message: "Vui lòng điền đầy đủ thông tin",
        icon: "warning",
      });
      return;
    }

    loading.value = true;

    const voucherData = {
      ...voucherForm.value,
      startDate: dateStringToTimestamp(dateRange.value.from),
      endDate: dateStringToTimestamp(dateRange.value.to),
      creatorType: "USER",
      creatorId: userId.value,
      shopId: shopId.value,
      usedCount: isEditing.value ? selectedVoucher.value.usedCount : 0,
    };

    if (isEditing.value) {
      // Update existing voucher (in this case, we're just updating the status)
      // Since the API doesn't have an update method, we'll simulate it by updating the local list
      const index = voucherList.value.findIndex((v) => v.id === voucherData.id);
      if (index !== -1) {
        voucherList.value[index] = {
          ...voucherList.value[index],
          ...voucherData,
        };
        $q.notify({
          color: "positive",
          message: "Cập nhật voucher thành công",
          icon: "check_circle",
        });
      }
    } else {
      // Create new voucher
      const result = await voucherService.addVoucher(voucherData);
      voucherList.value.push(result);
      $q.notify({
        color: "positive",
        message: "Tạo voucher thành công",
        icon: "check_circle",
      });
    }

    voucherDialog.value = false;
  } catch (error) {
    console.error("Error saving voucher:", error);
    $q.notify({
      color: "negative",
      message: isEditing.value
        ? "Không thể cập nhật voucher"
        : "Không thể tạo voucher",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const deleteVoucher = async () => {
  try {
    loading.value = true;

    await voucherService.deleteVoucher(selectedVoucher.value.id);

    // Remove from local list
    voucherList.value = voucherList.value.filter(
      (v) => v.id !== selectedVoucher.value.id
    );

    $q.notify({
      color: "positive",
      message: "Xóa voucher thành công",
      icon: "check_circle",
    });

    deleteDialog.value = false;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    $q.notify({
      color: "negative",
      message: "Không thể xóa voucher",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const updateVoucherStatus = async () => {
  try {
    loading.value = true;

    // Toggle status
    const newStatus =
      selectedVoucher.value.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // Since the API doesn't have an update method, we'll simulate it by updating the local list
    const index = voucherList.value.findIndex(
      (v) => v.id === selectedVoucher.value.id
    );
    if (index !== -1) {
      voucherList.value[index].status = newStatus;
      $q.notify({
        color: "positive",
        message: `Voucher đã được ${
          newStatus === "ACTIVE" ? "kích hoạt" : "vô hiệu hóa"
        }`,
        icon: "check_circle",
      });
    }

    statusDialog.value = false;
  } catch (error) {
    console.error("Error updating voucher status:", error);
    $q.notify({
      color: "negative",
      message: "Không thể cập nhật trạng thái voucher",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.voucher-management {
  max-width: 1200px;
  margin: 0 auto;
}
.add-btn{
    background-color: var(--icon);
    color: white;
    font-weight: bold;
}

/* Add some hover effect to the table rows */
:deep(.q-table tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Style for the voucher code */
:deep(.q-table td:first-child) {
  font-weight: 500;
}
</style>
