<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Quản lý cửa hàng</div>
      <div>
        <q-btn
          color="orange-8"
          icon="refresh"
          label="Làm mới"
          class="q-mr-sm"
          @click="refreshData"
        />
        <q-btn
          color="black"
          icon="filter_alt"
          label="Bộ lọc"
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
              placeholder="Tìm theo mã"
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
              v-model="businessTypeFilter"
              :options="businessTypeOptions"
              dense
              outlined
              label="Mô hình kinh doanh"
              emit-value
              map-options
              clearable
            />
          </div>
        </div>

        <q-table
          :rows="filteredShops"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body-cell-shopAvatarUrl="props">
            <q-td :props="props">
              <q-avatar size="40px">
                <q-img
                  :src="
                    isValidImageUrl(props.value)
                      ? props.value
                      : 'https://cdn.quasar.dev/img/mountains.jpg'
                  "
                  spinner-color="orange-8"
                />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-shopIsOpen="props">
            <q-td :props="props">
              <q-badge :color="props.value ? 'positive' : 'negative'">
                {{ props.value ? "Open" : "Closed" }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-shopIsApproved="props">
            <q-td :props="props">
              <q-badge :color="props.value ? 'positive' : 'negative'">
                {{ props.value ? "Approved" : "Pending" }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-shopRating="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-rating
                  v-model="props.value"
                  size="1em"
                  color="orange"
                  readonly
                />
                <span class="q-ml-sm">{{ props.value || "0" }}</span>
              </div>
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
                @click="viewShop(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="blue"
                @click="editShop(props.row)"
              />
              <q-btn
                flat
                round
                dense
                :icon="props.row.shopIsOpen ? 'lock' : 'lock_open'"
                :color="props.row.shopIsOpen ? 'negative' : 'positive'"
                @click="toggleShopStatus(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Shop Details Dialog -->
    <q-dialog v-model="shopDetailsDialog" maximized>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Shop Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedShop">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-card flat bordered>
                <q-card-section class="column items-center">
                  <q-avatar size="100px" class="q-mb-md">
                    <q-img
                      :src="
                        isValidImageUrl(selectedShop.shopAvatarUrl)
                          ? selectedShop.shopAvatarUrl
                          : 'https://cdn.quasar.dev/img/mountains.jpg'
                      "
                      spinner-color="orange-8"
                    />
                  </q-avatar>
                  <div class="text-h5">{{ selectedShop.shopName }}</div>
                  <div class="q-mt-sm">
                    <q-badge
                      :color="selectedShop.shopIsOpen ? 'positive' : 'negative'"
                      class="q-mr-xs"
                    >
                      {{ selectedShop.shopIsOpen ? "Open" : "Closed" }}
                    </q-badge>
                    <q-badge
                      :color="
                        selectedShop.shopIsApproved ? 'positive' : 'negative'
                      "
                    >
                      {{ selectedShop.shopIsApproved ? "Approved" : "Pending" }}
                    </q-badge>
                  </div>
                  <div class="q-mt-sm row items-center">
                    <q-rating
                      v-model="selectedShop.shopRating"
                      size="1.5em"
                      color="orange"
                      readonly
                    />
                    <span class="q-ml-sm">{{
                      selectedShop.shopRating || "No ratings"
                    }}</span>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-subtitle1">Contact Information</div>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Full Name</q-item-label>
                        <q-item-label>{{ selectedShop.fullName }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Phone Number</q-item-label>
                        <q-item-label>{{
                          selectedShop.phoneNumber
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Business Type</q-item-label>
                        <q-item-label>{{
                          selectedShop.businessType || "Not specified"
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Tax Code</q-item-label>
                        <q-item-label>{{
                          selectedShop.taxCode || "Not specified"
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-8">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1">Shop Description</div>
                  <div>
                    {{
                      selectedShop.shopDescription || "No description provided"
                    }}
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-subtitle1">Address</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <div class="text-caption text-grey">Specific Address</div>
                      <div>{{ selectedShop.specificAddress }}</div>
                    </div>
                    <div class="col-4">
                      <div class="text-caption text-grey">Province</div>
                      <div>
                        {{ selectedShop.provinceName || "Not specified" }}
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="text-caption text-grey">District</div>
                      <div>
                        {{ selectedShop.districtName || "Not specified" }}
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="text-caption text-grey">Ward</div>
                      <div>{{ selectedShop.wardName || "Not specified" }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-subtitle1">ID Verification</div>
                  <div class="row q-col-gutter-md q-mt-sm">
                    <div class="col-6">
                      <div class="text-caption text-grey">ID Full Name</div>
                      <div>{{ selectedShop.idFullName }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey">ID Number</div>
                      <div>{{ selectedShop.idNumber }}</div>
                    </div>
                  </div>
                  <div class="row q-col-gutter-md q-mt-sm">
                    <div class="col-6">
                      <div class="text-caption text-grey">ID Front Image</div>
                      <q-img
                        :src="selectedShop.idFrontImageUrl"
                        spinner-color="orange-8"
                        style="max-height: 200px; max-width: 100%"
                        class="rounded-borders"
                      />
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey">ID Back Image</div>
                      <q-img
                        :src="selectedShop.idBackImageUrl"
                        spinner-color="orange-8"
                        style="max-height: 200px; max-width: 100%"
                        class="rounded-borders"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-subtitle1">Products</div>
                  <div
                    v-if="
                      selectedShop.productIdList &&
                      selectedShop.productIdList.length > 0
                    "
                  >
                    <div class="text-body1">
                      Total Products: {{ selectedShop.productIdList.length }}
                    </div>
                    <q-btn
                      color="orange-8"
                      label="View Products"
                      icon="inventory_2"
                      class="q-mt-sm"
                    />
                  </div>
                  <div v-else>No products available</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Shop Actions -->
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1">Shop Actions</div>
                  <div class="row q-col-gutter-sm q-mt-sm">
                    <div class="col-auto">
                      <q-btn
                        color="orange-8"
                        label="Edit Shop"
                        icon="edit"
                        @click="editShop(selectedShop)"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn
                        :color="
                          selectedShop.shopIsOpen ? 'negative' : 'positive'
                        "
                        :label="
                          selectedShop.shopIsOpen ? 'Close Shop' : 'Open Shop'
                        "
                        :icon="selectedShop.shopIsOpen ? 'lock' : 'lock_open'"
                        @click="toggleShopStatus(selectedShop)"
                      />
                    </div>
                    <div class="col-auto" v-if="!selectedShop.shopIsApproved">
                      <q-btn
                        color="positive"
                        label="Approve Shop"
                        icon="check_circle"
                        @click="approveShop(selectedShop)"
                      />
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
          <div class="text-h6">Filter Shops</div>
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
            v-model="businessTypeFilter"
            :options="businessTypeOptions"
            label="Business Type"
            outlined
            emit-value
            map-options
            clearable
            class="q-mb-md"
          />

          <q-toggle
            v-model="hasProductsFilter"
            label="Has Products"
            color="orange-8"
            class="q-mb-md"
          />

          <q-input
            v-model="minRatingFilter"
            type="number"
            label="Minimum Rating"
            outlined
            min="0"
            max="5"
            step="0.1"
          />
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
// Import your shop service here
import shopService from "../../services/shop.service";
// import adminService from '../services/admin.service'

const shops = ref([]);

const columns = [
  {
    name: "shopAvatarUrl",
    label: "Avatar",
    field: "shopAvatarUrl",
    align: "center",
  },
  {
    name: "shopName",
    label: "Shop Name",
    field: "shopName",
    align: "left",
    sortable: true,
  },
  {
    name: "fullName",
    label: "Owner",
    field: "fullName",
    align: "left",
    sortable: true,
  },
  { name: "phoneNumber", label: "Phone", field: "phoneNumber", align: "left" },
  {
    name: "shopIsOpen",
    label: "Status",
    field: "shopIsOpen",
    align: "center",
    sortable: true,
  },
  {
    name: "shopIsApproved",
    label: "Approval",
    field: "shopIsApproved",
    align: "center",
    sortable: true,
  },
  {
    name: "shopRating",
    label: "Rating",
    field: "shopRating",
    align: "center",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const statusOptions = [
  { label: "Open", value: true },
  { label: "Closed", value: false },
];

const businessTypeOptions = [
  { label: "Individual", value: "individual" },
  { label: "Business", value: "business" },
];

const filter = ref("");
const statusFilter = ref(null);
const businessTypeFilter = ref(null);
const hasProductsFilter = ref(false);
const minRatingFilter = ref(null);
const loading = ref(false);
const pagination = ref({
  sortBy: "shopName",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const shopDetailsDialog = ref(false);
const selectedShop = ref(null);
const filterDialog = ref(false);

const filteredShops = computed(() => {
  let result = [...shops.value];

  if (filter.value) {
    const searchTerm = filter.value.toLowerCase();
    result = result.filter(
      (shop) =>
        shop.shopName.toLowerCase().includes(searchTerm) ||
        (shop.fullName && shop.fullName.toLowerCase().includes(searchTerm)) ||
        (shop.phoneNumber && shop.phoneNumber.includes(searchTerm))
    );
  }

  if (statusFilter.value !== null) {
    result = result.filter((shop) => shop.shopIsOpen === statusFilter.value);
  }

  if (businessTypeFilter.value) {
    result = result.filter(
      (shop) => shop.businessType === businessTypeFilter.value
    );
  }

  if (hasProductsFilter.value) {
    result = result.filter(
      (shop) => shop.productIdList && shop.productIdList.length > 0
    );
  }

  if (minRatingFilter.value !== null) {
    result = result.filter((shop) => shop.shopRating >= minRatingFilter.value);
  }

  return result;
});

const isValidImageUrl = (url) => {
  if (!url) return false;
  return url.startsWith("http");
};

const refreshData = async () => {
  loading.value = true;
 try{
  shops.value = await shopService.getAll()
 }catch(error){
    console.error("Error fetching shops:", error);
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

const viewShop = (shop) => {
  selectedShop.value = shop;
  shopDetailsDialog.value = true;
};

const editShop = (shop) => {
  console.log("Edit shop:", shop);
  // Implement edit shop functionality
};

const toggleShopStatus = async (shop) => {
  // In a real app, call API to toggle shop status
  // try {
  //   if (shop.shopIsOpen) {
  //     await adminService.closeShop(shop.id);
  //   } else {
  //     await adminService.openShop(shop.id);
  //   }
  //   shop.shopIsOpen = !shop.shopIsOpen;
  // } catch (error) {
  //   console.error('Error toggling shop status:', error);
  // }

  shop.shopIsOpen = !shop.shopIsOpen;
};

const approveShop = async (shop) => {
  // In a real app, call API to approve shop
  // try {
  //   await adminService.approveShop(shop.id);
  //   shop.shopIsApproved = true;
  // } catch (error) {
  //   console.error('Error approving shop:', error);
  // }

  shop.shopIsApproved = true;
};

const resetFilters = () => {
  statusFilter.value = null;
  businessTypeFilter.value = null;
  hasProductsFilter.value = false;
  minRatingFilter.value = null;
};

const applyFilters = () => {
  filterDialog.value = false;
  // The computed filteredShops will automatically update
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
