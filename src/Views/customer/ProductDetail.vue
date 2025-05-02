<template>
  <q-page>
    <div class="page-container row" v-if="product">
      <!-- Left Thumbnails -->
      <div class="col-auto">
        <div class="thumbnail-container">
          <q-img
            v-for="(img, index) in product.imageList"
            :key="index"
            :src="img"
            :class="{ 'thumbnail-active': selectedImage === index }"
            class="thumbnail-image q-mb-sm cursor-pointer"
            @click="selectedImage = index"
            width="60px"
            height="60px"
          />
        </div>
      </div>

      <!-- Main Image -->
      <div class="col-12 col-sm-6">
        <q-carousel
          v-model="selectedImage"
          arrows
          animated
          navigation
          infinite
          height="600px"
        >
          <q-carousel-slide
            v-for="(img, index) in product.imageList"
            :key="index"
            :name="index"
          >
            <q-img :src="img" fit="contain" height="500px" class="full-width" />
          </q-carousel-slide>
        </q-carousel>
        <div class="q-mt-xl q-px-md reviews-section">
          <div class="reviews-header">
            <div class="text-h6">Đánh giá sản phẩm</div>
            <q-select
              v-model="sortReviewsBy"
              :options="sortOptions"
              dense
              outlined
              label="Lọc"
              style="width: 200px"
            />
          </div>

          <div class="reviews-list">
            <div
              v-for="review in paginatedReviews"
              :key="review.id"
              class="review-item"
            >
              <!-- Star Rating -->
              <div class="stars-container">
                <div class="reviewer-info">
                  <q-avatar size="24px" color="grey-3" text-color="primary">
                    <img :src="review.avatarUrl" />
                  </q-avatar>
                  <div class="reviewer-name">{{ review.username }}</div>
                  <div class="review-date">
                    {{ formatDate(review.reviewCreatedDate) }}
                  </div>
                </div>
              </div>

              <!-- Review Content -->
              <div class="review-content">
                <div class="review-text">
                  <span v-if="!expandedReviews[review.id]">
                    {{
                      review.reviewComment.length > 80
                        ? review.reviewComment.slice(0, 80) + "..."
                        : review.reviewComment
                    }}
                    <q-btn
                      flat
                      dense
                      color="primary"
                      v-if="review.reviewComment.length > 80"
                      @click="toggleReviewExpansion(review.id)"
                      :label="
                        expandedReviews[review.id] ? 'Thu gọn' : 'Xem thêm'
                      "
                    />
                  </span>
                  <span v-else>
                    {{ review.reviewComment }}
                  </span>
                </div>
                <!-- //* Review Image  review.reviewImage is List*/ -->
                <div v-if="review.reviewImage && review.reviewImage.length > 0">
                  <div
                    v-for="(image, index) in review.reviewImage"
                    :key="index"
                  >
                    <img class="review-img" :src="image" alt="Review Image" />
                  </div>
                </div>
              </div>

              <!-- Review Ratings -->
              <div class="review-ratings">
                <div class="rating-item">
                  <span class="rating-label">Chất lượng</span>
                  <div class="rating-stars">
                    <q-rating
                      :model-value="review.reviewRating"
                      size="1.2em"
                      color="black"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination-container">
            <q-pagination
              v-model="currentPage"
              :max="Math.ceil(reviewsOfProduct.length / itemsPerPage)"
              direction-links
              boundary-links
              input
              input-class="q-ml-md"
            />
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div class="col-12 col-sm-5">
        <div class="text-h4 q-mt-sm" v-if="product.basePrice > 0">
          {{ formatPrice(product.basePrice) }}
        </div>

        <div class="text-h4 q-mt-sm" v-if="selectedPrice !== null">
          {{ formatPrice(selectedPrice) }}
        </div>

        <div class="text-body1 q-mt-lg">{{ product.productTitle }}</div>
        <div class="q-mt-sm">
          <q-rating
            v-model="product.rating"
            size="1em"
            color="amber"
            readonly
          />
        </div>

        <div
          v-for="(options, attribute) in attributeOptions"
          :key="attribute"
          class="q-mt-lg"
        >
          <div class="text-subtitle2">{{ attribute }} *</div>
          <q-select
            v-model="selectedAttributes[attribute]"
            :options="options"
            outlined
            dense
            class="q-mt-sm"
            @update:model-value="updatePrice"
          />
        </div>

        <div class="q-mt-lg" v-if="product.personalizationDescription">
          <div>Thêm tính cá nhân hóa</div>
          <div class="text-subtitle-10 text-grey-8">
            + {{ product.personalizationDescription }}
          </div>
          <div>
            <q-input
              class="personal-input"
              dense
              outlined
              v-model="cartItem.personalizationOfClient"
              autogrow
              :error="personalError"
              :error-message="personalErrorMessage"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="q-mt-lg">
          <!-- Nút Mua Ngay -->
          <q-btn
            v-if="userId"
            color="primary"
            label="Mua ngay"
            class="full-width q-mb-sm"
            size="lg"
            @click="buyItNow"
          />
          <q-btn
            v-else
            color="primary"
            label="Đăng nhập để mua"
            class="full-width q-mb-sm"
            size="lg"
            @click="redirectToLogin"
          />

          <!-- Nút Thêm vào giỏ hàng -->
          <q-btn
            v-if="userId"
            color="black"
            label="Thêm vào giỏ hàng"
            class="full-width"
            size="lg"
            @click="addToCart"
          />
        </div>

        <!-- Expandable Sections -->
        <q-list padding class="q-mt-lg">
          <q-expansion-item
            group="details"
            icon="info"
            label="Mô tả sản phẩm"
            default-opened
          >
            <q-card>
              <q-card-section>
                <div>
                  {{ product.productDescription }}
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            group="details"
            icon="store"
            label="Gặp gỡ người bán"
          >
            <q-card>
              <q-card-section v-if="shopData">
                <q-item clickable :to="'/customer/shop-detail/' + shopData?.id">
                  <q-item-section avatar>
                    <q-avatar size="50px">
                      <img
                        :src="shopData?.shopAvatarUrl || 'default-avatar.png'"
                        alt="Shop Avatar"
                      />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <div class="text-caption">
                      Owner of {{ shopData?.shopName || "Unknown Shop" }}
                    </div>
                  </q-item-section>
                </q-item>

                <q-btn
                  rounded
                  no-caps
                  outline
                  color="primary"
                  label="Hỏi người bán"
                  class="q-mt-md"
                  @click="openChatDialog"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <!-- Reviews Section - Redesigned to match the image -->
      </div>
    </div>

    <div class="product-list-container q-mt-xl q-px-md">
      <div class="text-h6 q-mb-md">Xem thêm từ cửa hàng</div>
      <div class="product-list">
        <div
          v-for="(item, index) in productFromThisShop"
          :key="index"
          class="product-item"
          @click="navigateToProduct(item)"
        >
          <q-card class="cursor-pointer product-card">
            <div class="image-container">
              <q-img :src="item.imageList[0]" class="product-image" />
              <q-btn
                round
                flat
                dense
                color="grey-7"
                icon="favorite_border"
                class="absolute-top-right favorite-btn"
              />
            </div>
            <q-card-section class="q-pa-sm">
              <div class="text-subtitle2 ellipsis-2-lines product-title">
                {{ item.productTitle }}
              </div>
              <div class="shop-name text-grey-7">{{ item.shopName }}</div>
              <div class="price-container">
                <div class="current-price">
                  {{ formatPrice(getNomalProductPrice(item)) }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <!-- Similar Products Carousel -->
    <div class="q-mt-xl q-px-md">
      <div class="text-h6 q-mb-md">Bạn có thể thích</div>
      <div class="carousel-container">
        <q-btn
          round
          flat
          dense
          icon="chevron_left"
          class="carousel-nav-btn carousel-prev-btn"
          @click="scrollCarousel('similar', -1)"
        />
        <div class="carousel-wrapper" ref="similarProductsRef">
          <div
            v-for="(item, index) in similarProducts"
            :key="index"
            class="carousel-item"
            @click="navigateToProduct(item)"
          >
            <q-card class="product-card cursor-pointer">
              <q-img :src="item.image_list[0]" :ratio="1" />
              <q-card-section>
                <div class="text-subtitle2 ellipsis-2-lines">
                  {{ item.product_title }}
                </div>
                <div class="text-h6">
                  {{ formatPrice(getProductPrice(item)) }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-btn
          round
          flat
          dense
          icon="chevron_right"
          class="carousel-nav-btn carousel-next-btn"
          @click="scrollCarousel('similar', 1)"
        />
      </div>
    </div>

    <!-- Diverse Products Carousel -->
    <div class="q-mt-xl q-px-md q-pb-xl">
      <div class="text-h6 q-mb-md">Khám phá mới</div>
      <div class="carousel-container">
        <q-btn
          round
          flat
          dense
          icon="chevron_left"
          class="carousel-nav-btn carousel-prev-btn"
          @click="scrollCarousel('diverse', -1)"
        />
        <div class="carousel-wrapper" ref="diverseProductsRef">
          <div
            v-for="(item, index) in diverseProducts"
            :key="index"
            class="carousel-item"
            @click="navigateToProduct(item)"
          >
            <q-card class="product-card cursor-pointer">
              <q-img :src="item.image_list[0]" :ratio="1" />
              <q-card-section>
                <div class="text-subtitle2 ellipsis-2-lines">
                  {{ item.product_title }}
                </div>
                <div class="text-h6">
                  {{ formatPrice(getProductPrice(item)) }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-btn
          round
          flat
          dense
          icon="chevron_right"
          class="carousel-nav-btn carousel-next-btn"
          @click="scrollCarousel('diverse', 1)"
        />
      </div>
    </div>

    <q-dialog v-model="chatDialog">
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Trò chuyện với người bán</div>
        </q-card-section>
        <q-card-section>
          <ChatComponent :receiver-id="shopData?.id" :currentUserId="userId" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="negative" @click="closeChatDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import productService from "../../services/product.service";
import shopService from "../../services/shop.service";
import cartService from "../../services/cart.service";
import { useNotification } from "@kyvg/vue3-notification";
import productRecommendationService from "../../services/productRecommendation.service";
import reviewService from "../../services/review.service";
import ChatComponent from "../../components/ChatComponent.vue";

const cartId = localStorage.getItem("cartId");
const { notify } = useNotification();
const userId = localStorage.getItem("userId");
const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const product = ref(null);
const shopData = ref(null);
const chatDialog = ref(false);
const personalText = ref("");
const personalError = ref(false);
const personalErrorMessage = ref("");

const selectedAttributes = ref({});
const attributeOptions = ref({});
const selectedPrice = ref(null);
const selectedImage = ref(0);

const productFromThisShop = ref([]);
const reviewsOfProduct = ref([]);
const suggestedProductList = ref(null);
const similarProducts = ref([]);
const diverseProducts = ref([]);

const similarProductsRef = ref(null);
const diverseProductsRef = ref(null);

const cartItem = ref({
  productId: "",
  quantity: 1,
  selectedOptions: [],
  subPrice: 1,
  personalizationDescription: "",
  personalizationOfClient: "",
  personalizationRequired: false,
});

const productBuyItNow = ref({
  productId: "",
  productTitle: "",
  productImage: "",
  quantity: 1,
  shopId: "",
  shopName: "",
  shopAvatarUrl: "",
  variationList: "",
  selectedOptions: [],
  subPrice: 1,
  personalizationDescription: "",
  personalizationOfClient: "",
  personalizationRequired: false,
  provinceId: "",
  districtId: "",
  wardId: "",
});

const sortReviewsBy = ref("Đánh giá tốt");
const sortOptions = ["Đánh giá tốt", "Đánh giá xấu", "Mới nhất", "Cũ nhất"];
const currentPage = ref(1);

const itemsPerPage = 4;
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return reviewsOfProduct.value.slice(start, start + itemsPerPage);
});

const expandedReviews = ref({});

const toggleReviewExpansion = (reviewId) => {
  expandedReviews.value[reviewId] = !expandedReviews.value[reviewId];
};

const openChatDialog = () => {
  chatDialog.value = true;
};
const closeChatDialog = () => {
  chatDialog.value = false;
};

const redirectToLogin = () => {
  router.push("/login");
};

onBeforeMount(async () => {
  await fetchData();
});

async function buyItNow() {
  try {
    if (
      product.value.personalizationDescription &&
      !cartItem.value.personalizationOfClient.trim()
    ) {
      personalError.value = true;
      personalErrorMessage.value = "Vui lòng nhập nội dung cá nhân hóa!";
      return;
    } else {
      personalError.value = false;
      personalErrorMessage.value = "";
    }

    productBuyItNow.value.productId = productId;
    productBuyItNow.value.selectedOptions = selectedAttributes.value;
    if (product.value.basePrice > 0) {
      productBuyItNow.value.subPrice = product.value.basePrice;
    } else {
      productBuyItNow.value.subPrice = selectedPrice.value;
    }

    productBuyItNow.value.shopId = shopData.value.id;
    productBuyItNow.value.shopName = shopData.value.shopName;
    productBuyItNow.value.shopAvatarUrl = shopData.value.shopAvatarUrl;
    productBuyItNow.value.variationList = product.value.variationList;
    productBuyItNow.value.productTitle = product.value.productTitle;
    productBuyItNow.value.productImage = product.value.imageList[0];
    productBuyItNow.value.provinceId = shopData.value.provinceId;
    productBuyItNow.value.districtId = shopData.value.districtId;
    productBuyItNow.value.wardId = shopData.value.wardId;
    console.log(productBuyItNow.value);

    productBuyItNow.value.personalizationRequired =
      product.value.personalizationDescription != "";

    console.log(productBuyItNow.value);
    localStorage.setItem("cartItem", JSON.stringify(productBuyItNow.value));
    router.push("/customer/checkout");
  } catch (error) {
    console.log(error);
  }
}

watch(
  () => route.params.id,
  async (newProductId, oldProductId) => {
    if (newProductId !== oldProductId) {
      await fetchData(newProductId);
    }
  }
);

async function fetchData(newProductId) {
  try {
    const id = newProductId || productId;
    product.value = await productService.getProductById(id);

    productFromThisShop.value = await shopService.getProductsByShopId(
      product.value.shopId
    );
    console.log(productFromThisShop.value);
    shopData.value = await shopService.getById(product.value.shopId);
    suggestedProductList.value =
      await productRecommendationService.getRecommendations(product.value.id);

    reviewsOfProduct.value = await reviewService.getReviewByProductId(
      product.value.id
    );

    if (suggestedProductList.value) {
      similarProducts.value = suggestedProductList.value.similar_products || [];
      diverseProducts.value = suggestedProductList.value.diverse_products || [];
    }

    if (product.value.variationList?.length) {
      generateOptionList();
    }
  } catch (error) {
    console.error(error);
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

// Update the format date function to match the image format
const formatDate = (dateString) => {
  const timestamp = parseFloat(dateString) * 1000;
  const date = new Date(timestamp);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getNomalProductPrice = (product) => {
  if (product.basePrice > 0) {
    return product.basePrice;
  } else if (product.variationList && product.variationList.length > 0) {
    return product.variationList[0].price;
  }
  return 0;
};

const getProductPrice = (product) => {
  if (product.base_price > 0) {
    return product.base_price;
  } else if (product.variation_list && product.variation_list.length > 0) {
    return product.variation_list[0].price;
  }
  return 0;
};

const navigateToProduct = (product) => {
  router.push(`/customer/product-detail/${product.id || product._id}`);
};

const scrollCarousel = (type, direction) => {
  const ref =
    type === "similar" ? similarProductsRef.value : diverseProductsRef.value;
  if (ref) {
    const scrollAmount = ref.offsetWidth * 0.8 * direction;
    ref.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

async function addToCart() {
  try {
    if (
      product.value.personalizationDescription &&
      !cartItem.value.personalizationOfClient.trim()
    ) {
      personalError.value = true;
      personalErrorMessage.value = "Vui lòng nhập nội dung cá nhân hóa!";
      return;
    } else {
      personalError.value = false;
      personalErrorMessage.value = "";
    }

    cartItem.value.productId = productId;
    cartItem.value.selectedOptions = selectedAttributes.value;
    if (product.value.basePrice > 0) {
      cartItem.value.subPrice = product.value.basePrice;
    } else {
      cartItem.value.subPrice = selectedPrice.value;
    }

    cartItem.value.personalizationRequired =
      product.value.personalizationDescription != "";

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

function generateOptionList() {
  const variations = product.value.variationList;
  selectedPrice.value = product.value.variationList[0].price;

  attributeOptions.value = variations.reduce((acc, variation) => {
    Object.keys(variation.attributes).forEach((attr) => {
      if (!acc[attr]) acc[attr] = new Set();
      acc[attr].add(variation.attributes[attr]);
    });
    return acc;
  }, {});

  Object.keys(attributeOptions.value).forEach((attr) => {
    attributeOptions.value[attr] = Array.from(attributeOptions.value[attr]);
  });

  Object.keys(attributeOptions.value).forEach((attr) => {
    selectedAttributes.value[attr] = attributeOptions.value[attr][0];
  });

  updatePrice();
}

const updatePrice = () => {
  const selectedValues = selectedAttributes.value;

  if (
    Object.keys(selectedValues).length ===
    Object.keys(attributeOptions.value).length
  ) {
    const selectedVariation = product.value.variationList.find((variation) =>
      Object.keys(selectedValues).every(
        (attr) => variation.attributes[attr] === selectedValues[attr]
      )
    );

    selectedPrice.value = selectedVariation ? selectedVariation.price : null;
  } else {
    selectedPrice.value = null;
  }
};
</script>

<style scoped>
.product-list-container {
  width: 100%;
}

.product-list {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 16px;
  scrollbar-width: thin;
  scrollbar-color: #ff9800 #f1f1f1;
}

.product-list::-webkit-scrollbar {
  height: 6px;
}

.product-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.product-list::-webkit-scrollbar-thumb {
  background: #ff9800;
  border-radius: 10px;
}

.product-item {
  min-width: 180px;
  max-width: 200px;
  flex: 0 0 auto;
}

.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}



.image-container {
  position: relative;
  height: 180px;
}

.product-image {
  height: 100%;
  object-fit: cover;
}

.favorite-btn {
  margin: 8px;
  background: rgba(255, 255, 255, 0.8);
}

.product-title {
  font-size: 14px;
  line-height: 1.3;
  height: 36px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
}

.shop-name {
  font-size: 12px;
  margin-bottom: 8px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.current-price {
  font-weight: bold;
  font-size: 16px;
  color: #ff9800;
}

.original-price {
  font-size: 12px;
  text-decoration: line-through;
}

.discount-badge {
  font-size: 12px;
  color: #ff5722;
}

.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.page-container {
  padding: 20px 30px;
}
.thumbnail-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.thumbnail-image {
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.thumbnail-active {
  border-color: var(--q-primary);
}

.product-card {
  transition: all 0.3s ease;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.personal-input {
  width: 100%;
}

.review-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
}

.review-item:last-child {
  border-bottom: none;
}

.carousel-container {
  position: relative;
  padding: 0 40px;
}

.carousel-wrapper {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  gap: 16px;
  padding: 8px 0;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.carousel-item {
  flex: 0 0 calc(16% - 16px);
  min-width: 200px;
}

.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.carousel-prev-btn {
  left: 0;
}

.carousel-next-btn {
  right: 0;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}

/* Review Section Styles */
.reviews-section {
  max-width: 1200px;
  margin: 0 auto;
}

.review-img {
  width: 50px;
  height: auto;
}
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.reviews-list {
  border-top: 1px solid #e0e0e0;
}

.review-item {
  padding: 24px 0;
  border-bottom: 1px solid #e0e0e0;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  gap: 20px;
}

.stars-container {
  display: flex;
  align-items: flex-start;
}

.review-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-text {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  /* max-height: 100%;  */
  transition: max-height 0.3s ease;
}

.review-text[expanded] {
  -webkit-line-clamp: unset;
  max-height: none;
}

.reviewer-info {
  /* display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px; */
}

.reviewer-name {
  font-weight: 500;
}

.review-date {
  color: #666;
}

.review-image-container {
  margin-top: 12px;
}

.review-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.review-ratings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recommends {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #2e7d32;
  margin-bottom: 8px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.rating-label {
  color: #666;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .review-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .review-ratings {
    margin-top: 16px;
  }
}
</style>
