<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Quản lý sản phẩm</div>

    <!-- Search and Actions Bar -->
    <div class="row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Tìm kiếm sản phẩm..."
          class="full-width"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-6 text-right">
        <q-btn
          color="primary"
          icon="add"
          label="Thêm sản phẩm mới"
          to="/shop/add-products"
          class="q-ml-sm"
        />
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div
      v-else-if="filteredProducts.length === 0"
      class="flex flex-center q-pa-xl column"
    >
      <q-icon name="inventory_2" size="5em" color="grey-5" />
      <div class="text-h6 q-mt-md text-grey-8">Không tìm thấy sản phẩm nào</div>
      <q-btn
        color="primary"
        label="Thêm sản phẩm mới"
        icon="add"
        to="/shop/add-products"
        class="q-mt-md"
      />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="product-card">
          <!-- Product Image -->
          <q-img
            :src="product.imageList[0]"
            :ratio="4 / 3"
            class="product-image"
          >
            <template v-slot:loading>
              <q-spinner-dots color="white" />
            </template>
            <div
              class="absolute-bottom text-subtitle2 text-center bg-black bg-opacity-60 text-white"
            >
              {{
                product.variationList.length > 0
                  ? formatPriceRange(product.variationList)
                  : formatPrice(product.basePrice)
              }}
            </div>
          </q-img>

          <q-card-section>
            <div class="text-h6 ellipsis-2-lines">
              {{ product.productTitle }}
            </div>
            <div class="row items-center q-mt-xs">
              <q-icon name="inventory" size="xs" class="q-mr-xs" />
              <span class="text-caption"
                >Tồn kho: {{ getTotalStock(product.variationList) }}</span
              >
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-caption ellipsis-2-lines text-grey-8">
              {{ product.productDescription }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row q-gutter-xs flex-wrap">
              <q-chip
                v-for="(variation, index) in getVariationTypes(
                  product.variationList
                )"
                :key="index"
                size="sm"
                color="primary"
                text-color="white"
                class="q-ma-xs"
              >
                {{ variation }}
              </q-chip>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              flat
              color="primary"
              icon="edit"
              label="Chỉnh sửa"
              @click="openEditModal(product)"
            />
            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Xóa"
              @click="confirmDelete(product)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Pagination -->
    <div class="row justify-center q-mt-lg">
      <q-pagination
        v-model="currentPage"
        :max="Math.ceil(filteredProducts.length / itemsPerPage)"
        :max-pages="6"
        boundary-links
        direction-links
        color="primary"
      />
    </div>

    <!-- Edit Product Modal -->
    <q-dialog v-model="editModalOpen" persistent maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Chỉnh sửa sản phẩm</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <EditProductForm
            :productData="editedProduct"
            @update-success="editModalOpen = false" 
            @cancel="editModalOpen = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import EditProductForm from "../../components/EditProductForm.vue";
import shopService from "../../services/shop.service";

const $q = useQuasar();

// Data
const productList = ref([]);
// State
const loading = ref(false);
const updating = ref(false);
const searchQuery = ref("");
const editModalOpen = ref(false);
const editedProduct = ref({});
const shopId = ref(localStorage.getItem("shopId"));
const currentPage = ref(1);
const itemsPerPage = ref(8);

// Computed
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return productList.value;
  }

  const query = searchQuery.value.toLowerCase();
  return productList.value.filter(
    (product) =>
      product.productTitle.toLowerCase().includes(query) ||
      product.productDescription.toLowerCase().includes(query)
  );
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatPriceRange = (variations) => {
  if (!variations || variations.length === 0) return "N/A";

  const prices = variations.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};



const getTotalStock = (variations) => {
  if (!variations || variations.length === 0) return 0;
  return variations.reduce((sum, v) => sum + v.stock, 0);
};

const getVariationTypes = (variations) => {
  if (!variations || variations.length === 0) return [];

  const attributeSet = new Set();
  variations.forEach((variation) => {
    Object.keys(variation.attributes).forEach((key) => {
      attributeSet.add(key);
    });
  });

  return Array.from(attributeSet);
};

const openEditModal = (product) => {
  // Deep clone the product to avoid modifying the original
  editedProduct.value = JSON.parse(JSON.stringify(product));
  editModalOpen.value = true;
};

const confirmDelete = (product) => {
  $q.dialog({
    title: "Xác nhận xóa",
    message: `Bạn có chắc chắn muốn xóa sản phẩm "${product.productTitle}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteProduct(product.id);
  });
};

const deleteProduct = async (productId) => {
  loading.value = true;
  try {
    // In a real application, call the API to delete the product
    // await shopService.deleteProduct(productId)

    // For demo purposes, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Remove the product from the list
    productList.value = productList.value.filter((p) => p.id !== productId);

    $q.notify({
      color: "positive",
      message: "Sản phẩm đã được xóa thành công",
      icon: "check_circle",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    $q.notify({
      color: "negative",
      message: "Có lỗi xảy ra khi xóa sản phẩm",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const updateProduct = async (updatedProduct) => {
  updating.value = true;
  try {
    // In a real application, call the API to update the product
    // await shopService.updateProduct(updatedProduct)

    // For demo purposes, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update the product in the list
    const index = productList.value.findIndex(
      (p) => p.id === updatedProduct.id
    );
    if (index !== -1) {
      productList.value[index] = JSON.parse(JSON.stringify(updatedProduct));
    }

    $q.notify({
      color: "positive",
      message: "Sản phẩm đã được cập nhật thành công",
      icon: "check_circle",
    });

    editModalOpen.value = false;
  } catch (error) {
    console.error("Error updating product:", error);
    $q.notify({
      color: "negative",
      message: "Có lỗi xảy ra khi cập nhật sản phẩm",
      icon: "error",
    });
  } finally {
    updating.value = false;
  }
};

onBeforeMount(async () => {
  loading.value = true;
  try {
    productList.value = await shopService.getProductsByShopId(shopId.value);
    console.log(productList.value);
  } catch (error) {
    console.error(error);
    $q.notify({
      color: "negative",
      message: "Có lỗi xảy ra khi tải danh sách sản phẩm",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  transition: all 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.bg-opacity-60 {
  opacity: 0.8;
}
</style>
