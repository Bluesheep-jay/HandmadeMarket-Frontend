<template>
  <q-page padding>
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Handmade Market</div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Filters Sidebar - Giảm kích thước xuống -->
      <div class="col-12 col-md-2">
        <div class="filter-container">
          <!-- Price Filter -->
          <PriceFilter
            :products="products"
            @filter-products="handleFilteredProducts"
          />

          <!-- Có thể thêm các bộ lọc khác ở đây -->
        </div>
      </div>

      <!-- Product Grid - Tăng kích thước lên -->
      <div class="col-12 col-md-10">
        <div
          class="row q-col-gutter-md product-list-container"
          v-if="paginatedProducts.length > 0"
        >
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card
              class="product-card cursor-pointer"
              v-if="product.imageList"
            >
              <!-- Main Image -->
              <q-btn
                icon="favorite_border"
                color="red"
                text-color="white"
                round
                unelevated
                size="md"
                class="absolute-top-right q-ma-sm favorite-btn"
                @click.stop="addtoWishlist(product)"
              />
              <q-img
                @click="navigateToProduct(product.id)"
                :src="product.imageList[0]"
                :ratio="4 / 3"
                class="product-image"
              >
                <template v-slot:loading>
                  <q-spinner-dots color="white" />
                </template>
              </q-img>

              <q-card-section>
                <div
                  class="text-subtitle2 ellipsis-2-lines"
                  @click="navigateToProduct(product.id)"
                >
                  {{ product.productTitle }}
                </div>

                <!-- Rating -->
                <div class="row">
                  <div class="q-mr-lg">
                    <div class="row items-center q-gutter-x-sm">
                      <q-rating
                        v-model="product.rating"
                        size="1em"
                        color="amber"
                        readonly
                        icon-selected="star"
                        icon-half="star_half"
                      />
                      <span class="text-caption text-grey">
                        ({{ product.rating || 0 }})
                      </span>
                    </div>

                    <!-- Price -->
                    <div
                      class="row items-center q-gutter-x-sm q-mt-sm"
                      v-if="
                        product.variationList &&
                        product.variationList.length > 0
                      "
                    >
                      <div class="text-subtitle1 text-weight-bold">
                        {{ formatPrice(getLowestPrice(product.variationList)) }}
                      </div>
                    </div>
                    <div class="row items-center q-gutter-x-sm q-mt-sm" v-else>
                      <div class="text-subtitle1 text-weight-bold">
                        {{ formatPrice(product.basePrice) }}
                      </div>
                    </div>
                  </div>

                  <div>
                    <q-btn
                      icon="shopping_cart"
                      color="black"
                      text-color="white"
                      label="Thêm vào giỏ hàng"
                      class="full-width"
                      size="sm"
                      @click="addToCart(product)"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state q-pa-lg text-center">
          <q-icon name="search_off" size="5rem" color="grey-5" />
          <div class="text-h6 q-mt-md">Không tìm thấy sản phẩm</div>
          <div class="text-grey">Vui lòng thử lại với bộ lọc khác</div>
          <q-btn
            label="Xóa bộ lọc"
            color="orange"
            class="q-mt-md"
            @click="resetFilters"
          />
        </div>

        <!-- Pagination -->
        <div
          class="flex flex-center q-mt-lg"
          v-if="paginatedProducts.length > 0"
        >
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            boundary-numbers
            @update:model-value="updatePaginatedProducts"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotification } from "@kyvg/vue3-notification";
import PriceFilter from "./PriceFilter.vue";

import productService from "../../services/product.service";
import cartService from "../../services/cart.service";
import productRecommendationService from "../../services/productRecommendation.service";

const { notify } = useNotification();
const router = useRouter();
const route = useRoute();
const searchQuery = ref(route.query.q);
const seachCategoryId = ref(route.params.id);
const cartId = localStorage.getItem("cartId");
const products = ref([]);
const filteredProducts = ref([]);
const paginatedProducts = ref([]);
const loading = ref(false);
const page = ref(1);
const currentPage = ref(1);
const totalPages = ref(1);
const selectedProduct = ref(null);
const favoriteProducts = ref(new Set());
const itemsPerPage = 9; // Thay đổi từ 8 lên 9 sản phẩm trên mỗi trang

const cartItem = ref({
  productId: "",
  quantity: 1,
  selectedOptions: {},
  subPrice: 1,
  personalizationDescription: "",
  personalizationOfClient: "",
  personalizationRequired: false,
});
const shops = {
  "67c207a6eceae36f6d752214": "LuxuryJewels",
  "67c20766eceae36f6d75220b": "ArtisanCrafts",
};

onMounted(async () => {
  await loadProducts();
});

const addtoWishlist = (product) => {
  if (favoriteProducts.value.has(product.id)) {
    favoriteProducts.value.delete(product.id);
  } else {
    favoriteProducts.value.add(product.id);
  }
};

const loadProducts = async () => {
  try {
    if (searchQuery.value) {
      products.value = await await productRecommendationService.seachProduct(
        searchQuery.value
      );
    }
    if (seachCategoryId.value) {
      products.value = await productService.getAllByCategoryRootId(
        seachCategoryId.value
      );
    }

    // Khởi tạo filteredProducts với tất cả sản phẩm
    filteredProducts.value = [...products.value];
    updatePagination();
  } catch (error) {
    console.error("Error loading products:", error);
  }
  loading.value = false;
};

// Xử lý sản phẩm đã lọc từ component PriceFilter
const handleFilteredProducts = (filtered) => {
  filteredProducts.value = filtered;
  currentPage.value = 1; // Reset về trang đầu tiên khi lọc
  updatePagination();
};

// Cập nhật thông tin phân trang
const updatePagination = () => {
  totalPages.value = Math.ceil(filteredProducts.value.length / itemsPerPage);
  updatePaginatedProducts();
};

// Reset bộ lọc
const resetFilters = () => {
  filteredProducts.value = [...products.value];
  updatePagination();
};

async function addToCart(product) {
  selectedProduct.value = product;
  try {
    cartItem.value.productId = selectedProduct.value.id;

    if (product.variationList) {
      cartItem.value.selectedOptions = product.variationList[0].attributes;
    }

    if (product.basePrice > 0) {
      cartItem.value.subPrice = product.basePrice;
    } else {
      cartItem.value.subPrice = product.variationList[0].price;
    }

    cartItem.value.personalizationRequired =
      product.personalizationDescription != "";

    const res = await cartService.addToCart(cartId, cartItem.value);
    notify({
      title: "Success",
      text: "Xem giỏ hàng nhé!",
      type: "success",
      duration: 2000,
    });
  } catch (error) {
    console.log(error);
  }
}

watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = newQuery || "";
    loadProducts();
  }
);

const updatePaginatedProducts = () => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  paginatedProducts.value = filteredProducts.value.slice(startIndex, endIndex);
};

function navigateToProduct(productId) {
  router.push(`/customer/product-detail/${productId}`);
}

const getShopName = (shopId) => {
  return shops[shopId] || "Unknown Shop";
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getLowestPrice = (variations) => {
  return Math.min(...variations.map((v) => v.price));
};

const getOriginalPrice = (variations) => {
  return Math.max(...variations.map((v) => v.price));
};

function hasDiscount(product) {
  const prices = product.variationList.map((v) => v.price);
  return Math.min(...prices) < Math.max(...prices);
}

const calculateDiscount = (product) => {
  return 0;
};
</script>

<style scoped>
.filter-container {
  position: sticky;
  top: 20px;
}

.product-list-container {
  padding: 0 5px;
}

.product-card {
  transition: all 0.3s ease;
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

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.favorite-btn {
  right: 5px;
  z-index: 10;
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.favorite-btn:hover {
  transform: scale(1.3);
}

.empty-state {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

@media (max-width: 768px) {
  .filter-container {
    position: relative;
    top: 0;
    margin-bottom: 10px;
  }
}
</style>
