<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Quản lý sản phẩm</div>
      <div>
        <q-btn
          color="black"
          icon="filter_alt"
          label="Lọc"
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
              placeholder="Tìm kiếm sản phẩm ..."
              clearable
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="categoryFilter"
              :options="categoryOptions"
              dense
              outlined
              label="Phân loại"
              emit-value
              map-options
              clearable
            />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="approvalFilter"
              :options="approvalOptions"
              dense
              outlined
              label="Trạng thái"
              emit-value
              map-options
              clearable
            />
          </div>
        </div>

        <q-table
          :rows="filteredProducts"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body-cell-imageList="props">
            <q-td :props="props">
              <q-img
                :src="
                  props.row.imageList && props.row.imageList.length > 0
                    ? props.row.imageList[0]
                    : '/placeholder.jpg'
                "
                spinner-color="orange-8"
                style="height: 50px; width: 50px"
                fit="cover"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-price="props">
            <q-td :props="props">
              {{ formatCurrency(props.value) }}
            </q-td>
          </template>

          <template v-slot:body-cell-approved="props">
            <q-td :props="props">
              <q-badge
                :color="
                  props.value === '67ff79798226bac72b581e18'
                    ? 'positive'
                    : 'negative'
                "
              >
                {{
                  props.value === "67ff79798226bac72b581e18"
                    ? "Đã duyệt"
                    : "Chờ duyệt"
                }}
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
                @click="viewProduct(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="blue"
                @click="editProduct(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="check_circle"
                color="positive"
                v-if="!props.row.approved"
                @click="approveProduct(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Product Details Dialog -->
    <q-dialog v-model="productDetailsDialog" maximized>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Product Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedProduct">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-carousel
                v-if="
                  selectedProduct.imageList &&
                  selectedProduct.imageList.length > 0
                "
                v-model="slide"
                transition-prev="slide-right"
                transition-next="slide-left"
                swipeable
                animated
                control-color="orange-8"
                navigation
                padding
                arrows
                height="300px"
                class="bg-grey-1 rounded-borders"
              >
                <q-carousel-slide
                  v-for="(image, index) in selectedProduct.imageList"
                  :key="index"
                  :name="index"
                  class="column no-wrap flex-center"
                >
                  <q-img
                    :src="image"
                    spinner-color="orange-8"
                    style="max-height: 280px; max-width: 100%"
                  />
                </q-carousel-slide>
              </q-carousel>
            </div>

            <div class="col-12 col-md-8">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h5">{{ selectedProduct.productTitle }}</div>
                  <div class="text-subtitle1 q-mt-sm">
                    <q-badge color="orange-8">
                      {{ getCategoryName(selectedProduct.categoryId) }}
                    </q-badge>
                    <q-badge
                      :color="
                        selectedProduct.approved ? 'positive' : 'negative'
                      "
                      class="q-ml-sm"
                    >
                      {{
                        selectedProduct.approved
                          ? "Approved"
                          : "Pending Approval"
                      }}
                    </q-badge>
                  </div>

                  <div class="text-body1 q-mt-md">
                    {{ selectedProduct.productDescription }}
                  </div>

                  <div class="q-mt-md">
                    <div class="text-subtitle2">Product Details</div>
                    <div class="row q-col-gutter-sm">
                      <div class="col-6 col-md-3">
                        <div class="text-caption text-grey">Weight</div>
                        <div>{{ selectedProduct.weight }} kg</div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="text-caption text-grey">Dimensions</div>
                        <div>
                          {{ selectedProduct.length }}x{{
                            selectedProduct.width
                          }}x{{ selectedProduct.height }} cm
                        </div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="text-caption text-grey">Rating</div>
                        <div>{{ selectedProduct.rating || "No ratings" }}</div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="text-caption text-grey">Shop</div>
                        <div>{{ getShopName(selectedProduct.shopId) }}</div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="q-mt-md"
                    v-if="selectedProduct.personalizationDescription"
                  >
                    <div class="text-subtitle2">Personalization</div>
                    <div>{{ selectedProduct.personalizationDescription }}</div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-subtitle2">Variations</div>
                  <q-table
                    v-if="
                      selectedProduct.variationList &&
                      selectedProduct.variationList.length > 0
                    "
                    :rows="selectedProduct.variationList"
                    :columns="variationColumns"
                    row-key="price"
                    flat
                    bordered
                    dense
                  >
                    <template v-slot:body-cell-attributes="props">
                      <q-td :props="props">
                        <div v-for="(value, key) in props.value" :key="key">
                          <span class="text-caption text-grey">{{ key }}:</span>
                          {{ value }}
                        </div>
                      </q-td>
                    </template>

                    <template v-slot:body-cell-price="props">
                      <q-td :props="props">
                        {{ formatCurrency(props.value) }}
                      </q-td>
                    </template>
                  </q-table>
                  <div v-else>No variations available</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Product Actions -->
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1">Product Actions</div>
                  <div class="row q-col-gutter-sm q-mt-sm">
                    <div class="col-auto">
                      <q-btn
                        color="orange-8"
                        label="Edit Product"
                        icon="edit"
                        @click="editProduct(selectedProduct)"
                      />
                    </div>
                    <div class="col-auto" v-if="!selectedProduct.approved">
                      <q-btn
                        color="positive"
                        label="Approve Product"
                        icon="check_circle"
                        @click="approveProduct(selectedProduct)"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn
                        color="negative"
                        label="Delete Product"
                        icon="delete"
                        @click="confirmDelete(selectedProduct)"
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

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete this product?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteProduct"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Filter Dialog -->
    <q-dialog v-model="filterDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Filter Products</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="categoryFilter"
            :options="categoryOptions"
            label="Category"
            outlined
            emit-value
            map-options
            clearable
            class="q-mb-md"
          />

          <q-select
            v-model="approvalFilter"
            :options="approvalOptions"
            label="Approval Status"
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
                v-model="priceRange.min"
                outlined
                label="Min Price"
                type="number"
              />
            </div>

            <div class="col-6">
              <q-input
                v-model="priceRange.max"
                outlined
                label="Max Price"
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
import productService from "../../services/product.service";
const products = ref([]);

const categoryMap = {
  "68038b665ff2e4236af57bb9": "Gối",
  "68038b2b5ff2e4236af57bb7": "Gốm sứ nghệ thuật",
  "680388e45ff2e4236af57bb2": "Vòng tay",
  "68031d7c53265ae9bc695e36": "Trang phục truyền thống",
};

const shopMap = {
  "67c207a6eceae36f6d752214": "Hồng Ngọc Jewelry",
  "67c20766eceae36f6d75220b": "Ngọc Bích Jewelry",
  "67dd871228d8844aa6763686": "Nến nhà Mel",
};

const categoryOptions = ref([
  { label: "Bông tai", value: "67d845bfa1ef96f019be7108" },
  { label: "Vòng tay", value: "67d845dca1ef96f019be710a" },
  { label: "Nến", value: "67dd822cc338f4c49ee91f59" },
  { label: "Dây chuyền có mặt", value: "67d846cfa1ef96f019be7117" },
]);

const approvalOptions = ref([
  { label: "Đã duyệt", value: true },
  { label: "Chờ duyệt", value: false },
]);

const shopOptions = ref([
  { label: "Hồng Ngọc Jewelry", value: "67c207a6eceae36f6d752214" },
  { label: "Ngọc Bích Jewelry", value: "67c20766eceae36f6d75220b" },
  { label: "Nến nhà Mel", value: "67dd871228d8844aa6763686" },
]);

const columns = [
  { name: "imageList", label: "Hình ảnh", field: "imageList", align: "center" },
  {
    name: "productTitle",
    label: "Tên sản phẩm",
    field: "productTitle",
    align: "left",
    sortable: true,
  },
  {
    name: "categoryId",
    label: "Phân loại",
    field: "categoryId",
    align: "left",
    format: (val) => categoryMap[val] || "Unknown",
    sortable: true,
  },

  {
    name: "basePrice",
    label: "Giá thấp nhất",
    field: (row) =>
      row.basePrice > 0
        ? row.basePrice
        : row.variationList && row.variationList.length > 0
        ? row.variationList[0].price
        : 0,
    align: "right",
    sortable: true,
  },
  {
    name: "price",
    label: "Giá cao nhất",
    field: (row) =>
      row.basePrice > 0
        ? row.basePrice
        : row.variationList && row.variationList.length > 0
        ? row.variationList[row.variationList.length - 1].price
        : 0,
    align: "right",
    sortable: true,
  },
  {
    name: "stock",
    label: "Tồn kho",
    field: (row) =>
      row.variationList && row.variationList.length > 0
        ? row.variationList[0].stock
        : 0,
    align: "right",
    sortable: true,
  },
  {
    name: "rating",
    label: "Đánh giá",
    field: "rating",
    align: "center",
    sortable: true,
  },
  {
    name: "approved",
    label: "Trạng thái",
    field: "productStatusId",
    align: "center",
    sortable: true,
  },
  { name: "actions", label: "Hoạt động", field: "actions", align: "center" },
];

const variationColumns = [
  {
    name: "attributes",
    label: "Attributes",
    field: "attributes",
    align: "left",
  },
  { name: "price", label: "Price", field: "price", align: "right" },
  { name: "stock", label: "Stock", field: "stock", align: "right" },
];

const filter = ref("");
const categoryFilter = ref(null);
const approvalFilter = ref(null);
const shopFilter = ref(null);
const priceRange = ref({
  min: null,
  max: null,
});
const loading = ref(false);
const pagination = ref({
  sortBy: "productTitle",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const productDetailsDialog = ref(false);
const selectedProduct = ref(null);
const slide = ref(0);
const deleteDialog = ref(false);
const productToDelete = ref(null);
const filterDialog = ref(false);

const filteredProducts = computed(() => {
  let result = [...products.value];

  if (filter.value) {
    const searchTerm = filter.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.productTitle.toLowerCase().includes(searchTerm) ||
        product.productDescription.toLowerCase().includes(searchTerm)
    );
  }

  if (categoryFilter.value) {
    result = result.filter(
      (product) => product.categoryId === categoryFilter.value
    );
  }

  if (approvalFilter.value !== null) {
    result = result.filter(
      (product) => product.approved === approvalFilter.value
    );
  }

  if (shopFilter.value) {
    result = result.filter((product) => product.shopId === shopFilter.value);
  }

  if (priceRange.value.min !== null) {
    result = result.filter((product) => {
      const price =
        product.variationList && product.variationList.length > 0
          ? product.variationList[0].price
          : 0;
      return price >= priceRange.value.min;
    });
  }

  if (priceRange.value.max !== null) {
    result = result.filter((product) => {
      const price =
        product.variationList && product.variationList.length > 0
          ? product.variationList[0].price
          : 0;
      return price <= priceRange.value.max;
    });
  }

  return result;
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getCategoryName = (categoryId) => {
  return categoryMap[categoryId] || "Unknown Category";
};

const getShopName = (shopId) => {
  return shopMap[shopId] || "Unknown Shop";
};

const refreshData = async () => {
  loading.value = true;
  try {
    const productsData = await productService.getAll();
    products.value = productsData;
    console.log(products.value);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
  setTimeout(() => {
    loading.value = false;
  }, 500);
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

const viewProduct = (product) => {
  selectedProduct.value = product;
  slide.value = 0;
  productDetailsDialog.value = true;
};

const editProduct = (product) => {
  console.log("Edit product:", product);
  // Implement edit product functionality
};

const approveProduct = (product) => {
  console.log("Approve product:", product);
  // In a real app, call API to approve product
  // try {
  //   await productService.approveProduct(product.id);
  //   product.approved = true;
  // } catch (error) {
  //   console.error('Error approving product:', error);
  // }
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  deleteDialog.value = true;
};

const deleteProduct = async () => {
  console.log("Delete product:", productToDelete.value);
  // In a real app, call API to delete product
  // try {
  //   await productService.deleteProduct(productToDelete.value.id);
  //   products.value = products.value.filter(p => p.id !== productToDelete.value.id);
  // } catch (error) {
  //   console.error('Error deleting product:', error);
  // }
  products.value = products.value.filter(
    (p) => p.id !== productToDelete.value.id
  );
  productToDelete.value = null;

  if (productDetailsDialog.value) {
    productDetailsDialog.value = false;
  }
};

const resetFilters = () => {
  categoryFilter.value = null;
  approvalFilter.value = null;
  shopFilter.value = null;
  priceRange.value = { min: null, max: null };
};

const applyFilters = () => {
  filterDialog.value = false;
  // The computed filteredProducts will automatically update
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
