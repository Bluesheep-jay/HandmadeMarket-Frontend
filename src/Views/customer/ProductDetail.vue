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
              label="Sort by"
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
                <q-rating
                  v-model="review.reviewRating"
                  size="1.2em"
                  color="black"
                  readonly
                />
              </div>

              <!-- Review Content -->
              <div class="review-content">
                <div class="review-text">{{ review.reviewComment }}</div>

                <div class="reviewer-info">
                  <q-avatar size="24px" color="grey-3" text-color="primary">
                    <img :src="review.avatarUrl" />
                  </q-avatar>
                  <span class="reviewer-name"> {{ review.username }}</span>
                  <span class="review-date">{{
                    formatDate(review.reviewCreatedDate)
                  }}</span>
                </div>

                <!-- Review Image if available -->
                <div v-if="review.reviewImage" class="review-image-container">
                  <img :src="review.reviewImage" class="review-image" />
                </div>
              </div>

              <!-- Review Ratings -->
              <div class="review-ratings">
                <div class="rating-item">
                  <span class="rating-label">Item quality</span>
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
        <div class="text-h4 q-mt-sm" v-if="!product.variationList">
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
          <q-btn
            color="primary"
            label="Mua ngay"
            class="full-width q-mb-sm"
            size="lg"
          />
          <q-btn
            color="black"
            label="Thêm vào giỏ hàng"
            class="full-width"
            size="lg"
            @click="addToCart"
          />
          <q-btn
            flat
            color="primary"
            label="Yêu thích"
            class="full-width q-mt-sm"
            icon="favorite_border"
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
                  outline
                  color="primary"
                  label="Nhắn tin với người bán"
                  class="q-mt-md"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <!-- Reviews Section - Redesigned to match the image -->
      </div>
    </div>

    <!-- Similar Products Carousel -->
    <div class="q-mt-xl q-px-md">
      <div class="text-h6 q-mb-md">Sản phẩm tương tự</div>
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
      <div class="text-h6 q-mb-md">Bạn có thể thích</div>
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

const cartId = localStorage.getItem("cartId");
const { notify } = useNotification();
const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const product = ref(null);
const shopData = ref(null);

const personalText = ref("");
const personalError = ref(false);
const personalErrorMessage = ref("");

const selectedAttributes = ref({});
const attributeOptions = ref({});
const selectedPrice = ref(null);
const selectedImage = ref(0);

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

const sortReviewsBy = ref("Highest Rating");
const sortOptions = ["Highest Rating", "Lowest Rating", "Newest", "Oldest"];
const currentPage = ref(1);

const itemsPerPage = 4;
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return reviewsOfProduct.value.slice(start, start + itemsPerPage);
});

const getInitials = (userId) => {
  if (!userId) return "U";
  return userId.substring(0, 2).toUpperCase();
};

onBeforeMount(async () => {
  await fetchData();
});

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
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
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
  flex: 0 0 calc(20% - 16px);
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
  font-size: 16px;
  line-height: 1.5;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
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
