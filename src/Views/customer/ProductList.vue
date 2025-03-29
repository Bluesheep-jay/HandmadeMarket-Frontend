<template>
  <q-page padding>
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5">Handmade Market</div>
      <q-btn flat color="primary" label="See more" />
    </div>

    <!-- Product Grid -->
    <div
      class="row q-col-gutter-lg product-list-container"
      v-if="products.length > 0"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="col-12 col-sm-6 col-md-3 col-lg-3"
      >
        <q-card class="product-card cursor-pointer" v-if="product.imageList">
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

            <!-- <div class="text-caption text-grey q-mb-sm">
              {{ getShopName(product.shopId) }}
            </div> -->

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
                    product.variationList && product.variationList.length > 0
                  "
                >
                  <div class="text-subtitle1 text-weight-bold">
                    {{ formatPrice(getLowestPrice(product.variationList)) }}
                  </div>
                  <div
                    v-if="hasDiscount(product)"
                    class="text-caption text-grey text-line-through"
                  >
                    {{ formatPrice(getOriginalPrice(product.variationList)) }}
                  </div>
                  <q-badge
                    v-if="hasDiscount(product)"
                    color="negative"
                    text-color="white"
                  >
                    {{ calculateDiscount(product) }}% off
                  </q-badge>
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
                  size="md"
                  @click="addToCart(product)"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="flex flex-center q-mt-lg">
      <q-btn
        color="primary"
        label="Load more"
        :loading="loading"
        @click="loadMore"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotification } from "@kyvg/vue3-notification";

import productService from "../../services/product.service";
import cartService from "../../services/cart.service";

const { notify } = useNotification();
const router = useRouter();
const route = useRoute();
const searchQuery = ref(route.query.q);
const seachCategoryId = ref(route.params.id);
const cartId = localStorage.getItem("cartId");
const products = ref([]);
const loading = ref(false);
const page = ref(1);
const selectedProduct = ref(null);
const favoriteProducts = ref(new Set());

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
  loading.value = true;

  try {
    if (searchQuery.value) {
      products.value = await productService.getProductBySearchText(
        searchQuery.value
      );
    }
    if (seachCategoryId.value) {
      products.value = await productService.getAllByCategoryRootId(
        seachCategoryId.value
      );
    }

    console.log(products.value);
  } catch (error) {
    console.error("Error loading products:", error);
  }
  loading.value = false;
};

async function addToCart(product) {
  selectedProduct.value = product;
  try {
    // if (
    //   product.value.personalizationDescription &&
    //   !cartItem.value.personalizationOfClient.trim()
    // ) {
    //   personalError.value = true;
    //   personalErrorMessage.value = "Vui lòng nhập nội dung cá nhân hóa!";
    //   return;
    // } else {
    //   personalError.value = false;
    //   personalErrorMessage.value = "";
    // }
    console.log(selectedProduct.value);

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
    console.log(cartItem.value);

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

const loadMore = async () => {
  page.value++;
  await loadProducts();
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
  //   const lowest = getLowestPrice(product.variationList);
  //   const original = getOriginalPrice(product.variationList);
  //   return Math.round((1 - lowest / original) * 100);
  return 0;
};
</script>

<style scoped>
.product-list-container {
  padding: 0 10px;
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
  /* position: absolute; */
  /* top: -10px;  */
  right: 5px;
  z-index: 10; 
  transform: scale(1.1); /* Làm nó to lên một chút */
  transition: transform 0.2s ease-in-out;
}

.favorite-btn:hover {
  transform: scale(1.3); /* Hiệu ứng phóng to khi hover */
}

</style>
