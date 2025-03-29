<template>
  <div class="shop-detail-container q-pa-md" v-if="shop">
    <!-- Shop Header Section -->
    <div class="shop-header row q-mb-lg">
      <!-- Shop Avatar and Info -->
      <div class="col-12 col-md-8">
        <div class="row items-center">
          <q-avatar size="80px" class="shop-avatar">
            <img :src="shop.shopAvatarUrl" alt="Shop Avatar" />
          </q-avatar>
          <div class="shop-info q-ml-md">
            <h1 class="shop-name q-my-none">{{ shop.shopName }}</h1>

            <div class="shop-location text-caption q-mt-xs">
              {{ shop.provinceName }}, Vietnam
            </div>

            <!-- Star Rating -->
            <div class="rating-container q-mt-xs">
              <q-rating
                v-model="shop.shopRating"
                size="1em"
                color="black"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Shop Metrics -->
      <div class="col-12 col-md-4 shop-metrics">
        <div class="row justify-end">
          <!-- Follow Shop Button -->
          <q-btn
            outline
            color="primary"
            class="follow-shop-btn q-mb-md"
            icon-right="favorite"
            label="Following shop"
          />

          <!-- Metrics Cards -->
          <div class="metrics-container row q-col-gutter-md">
            <div class="col-6">
              <div class="metric-card q-pa-sm">
                <div class="text-center">
                  <q-icon name="speed" color="purple" size="sm" />
                </div>
                <div class="text-center text-weight-medium">Speedy replies</div>
                <div class="text-center text-caption">
                  Has a history of replying to messages quickly.
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="metric-card q-pa-sm">
                <div class="text-center">
                  <q-icon name="thumb_up" color="purple" size="sm" />
                </div>
                <div class="text-center text-weight-medium">Rave reviews</div>
                <div class="text-center text-caption">
                  Average review rating is 4.8 or higher
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Announcement Section -->
    <div class="announcement-section q-mb-lg">
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="announcement-card q-pa-md">
            <div class="row justify-between items-center q-mb-sm">
              <div class="text-weight-medium">Mô tả</div>
              <div class="text-caption">
                Last updated on {{ formatDate(new Date()) }}
              </div>
            </div>
            <div class="announcement-text q-mb-sm">
              {{ shop.shopDescription }}
            </div>
            <q-btn flat dense color="grey-7" label="Read more" no-caps />
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="navigation-tabs q-mb-md">
      <q-tabs
        v-model="activeTab"
        class="text-grey-8 nav-tab"
        active-color="black"
        indicator-color="black"
        narrow-indicator
      >
        <q-tab name="items" label="Items" />
        <q-tab name="reviews" label="Reviews" />
        <q-tab name="about" label="About" />
        <q-tab name="policies" label="Shop Policies" />
      </q-tabs>

      <!-- Search Bar -->
      <q-input
        v-model="searchQuery"
        outlined
        dense
        placeholder="Search all items"
        class="search-input q-mt-sm"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Main Content Area -->
    <div class="row q-col-gutter-md">
      <!-- Left Sidebar - Categories -->
      <div class="col-12 col-md-3">
        <div class="categories-sidebar">
          <!-- All Items -->
          <q-item
            clickable
            v-ripple
            :active="selectedCategory === 'all'"
            @click="selectedCategory = 'all'"
            active-class="active-category"
          >
            <q-item-section>All</q-item-section>
            <q-item-section side>{{ productList.length }}</q-item-section>
          </q-item>

          <!-- Best Sellers -->
          <q-item
            clickable
            v-ripple
            :active="selectedCategory === 'best-sellers'"
            @click="selectedCategory = 'best-sellers'"
            active-class="active-category"
          >
            <q-item-section>Best Sellers</q-item-section>
            <q-item-section side>{{
              Math.ceil(productList.length * 0.6)
            }}</q-item-section>
          </q-item>

          <!-- Generated Categories -->
          <q-item
            v-for="category in categories"
            :key="category.id"
            clickable
            v-ripple
            :active="selectedCategory === category.id"
            @click="selectedCategory = category.id"
            active-class="active-category"
          >
            <q-item-section>{{ category.name }}</q-item-section>
            <q-item-section side>{{ category.count }}</q-item-section>
          </q-item>

          <!-- Shop Actions -->
          <div class="shop-actions q-mt-lg">
            <q-btn
              outline
              color="grey-8"
              class="full-width q-mb-sm"
              icon="design_services"
              label="Request Custom Order"
              no-caps
            />
            <q-btn
              outline
              color="grey-8"
              class="full-width"
              icon="chat"
              label="Contact shop owner"
              no-caps
            />
          </div>

          <!-- Shop Stats -->
          <div class="shop-stats q-mt-lg">
            <div class="text-caption q-mb-xs">
              {{ formatSalesCount(productList.length * 200) }} Sales
            </div>
            <div class="text-caption">
              {{ Math.floor(productList.length * 60) }} Admirers
            </div>
            <q-separator class="q-my-md" />
            <q-btn
              flat
              dense
              color="grey-7"
              class="no-padding"
              icon="flag"
              label="Report this shop to Etsy"
              no-caps
            />
          </div>
        </div>
      </div>

      <!-- Main Content - Products Grid -->
      <div class="col-12 col-md-9">
        <!-- Category Title and Sort -->
        <div class="row justify-between items-center q-mb-md">
          <div class="text-h6">{{ getCategoryTitle() }}</div>
          <q-select
            v-model="sortOption"
            :options="sortOptions"
            label="Sort"
            dense
            outlined
            options-dense
            style="width: 200px"
          />
        </div>

        <!-- Products Grid -->
        <div class="row q-col-gutter-md">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="col-6 col-sm-4 col-md-4 col-lg-3"
          >
            <q-card class="product-card" flat bordered>
              <!-- Product Image -->
              <q-img
                :src="product.imageList[0]"
                :ratio="1"
                class="product-image"
              >
                <!-- Cart Badge -->
                <div
                  class="cart-badge"
                  v-if="getRandomCartCount(product.id) > 0"
                >
                  In {{ getRandomCartCount(product.id) }} carts
                </div>

                <!-- Rating Badge -->
                <div class="rating-badge">
                  <q-icon name="star" size="xs" />
                  {{
                    product.rating ||
                    (Math.floor(Math.random() * 10) / 2 + 3.5).toFixed(1)
                  }}
                </div>
              </q-img>

              <!-- Product Details -->
              <q-card-section class="q-pa-sm">
                <div class="product-title ellipsis-2-lines">
                  {{ product.productTitle }}
                </div>
                <div class="product-id text-caption text-grey">
                  {{ product.id.substring(0, 8) }}
                </div>
                <div class="product-price q-mt-xs">
                  <span class="text-weight-bold">{{
                    formatPrice(getProductPrice(product))
                  }}</span>
                </div>
                <div class="product-shipping text-caption q-mt-xs">
                  Shipping:
                  {{ Math.random() > 0.5 ? "Free" : formatPrice(50000) }}
                </div>
                <div class="product-delivery text-caption">
                  Est. delivery: {{ getRandomDeliveryDate() }}
                </div>
                <div class="product-returns text-caption">
                  Returns:
                  {{ Math.random() > 0.3 ? "Accepted" : "Not accepted" }}
                </div>

                <!-- Options Badge -->
                <q-badge
                  color="white"
                  text-color="grey-8"
                  class="options-badge q-mt-sm"
                  outline
                  v-if="hasMultipleOptions(product)"
                >
                  Multiple options
                </q-badge>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import shopService from "../../services/shop.service";

// Mock data for development - will be replaced with API calls
const shop = ref(null);
const productList = ref([]);
const collectionList = ref([
  { id: "nature", name: "Nature & Animals", productIds: [] },
  { id: "jewelry", name: "Quote Jewelry", productIds: [] },
  { id: "galaxy", name: "Galaxy Jewelry", productIds: [] },
]);

// UI state
const activeTab = ref("items");
const searchQuery = ref("");
const selectedCategory = ref("all");
const sortOption = ref("Most Recent");
const sortOptions = [
  "Most Recent",
  "Lowest Price",
  "Highest Price",
  "Top Customer Reviews",
];

// Random cart counts for products (simulating "In X carts" badges)
const cartCounts = ref({});

const route = useRoute();

onMounted(async () => {
  const shopId = route.params.id;

  try {
    // These would be actual API calls in production
    shop.value = await shopService.getById(shopId);
    productList.value = await shopService.getProductsByShopId(shopId);

    // Generate random cart counts for products
    productList.value.forEach((product) => {
      cartCounts.value[product.id] =
        Math.random() > 0.6 ? Math.floor(Math.random() * 15) + 1 : 0;
    });

    // assignProductsToCollections();
  } catch (error) {
    console.error("Error fetching shop data:", error);
  }
});

// Helper function to assign products to collections randomly
function assignProductsToCollections() {
  productList.value.forEach((product) => {
    // Assign each product to 1-3 random collections
    const numCollections = Math.floor(Math.random() * 3) + 1;
    const shuffledCollections = [...collectionList.value].sort(
      () => 0.5 - Math.random()
    );

    for (let i = 0; i < numCollections; i++) {
      if (shuffledCollections[i]) {
        shuffledCollections[i].productIds.push(product.id);
      }
    }
  });
}

// Computed properties
const categories = computed(() => {
  return collectionList.value.map((collection) => ({
    id: collection.id,
    name: collection.name,
    count: collection.productIds.length,
  }));
});

const filteredProducts = computed(() => {
  let filtered = [...productList.value];

  // Filter by category
  if (selectedCategory.value !== "all") {
    if (selectedCategory.value === "best-sellers") {
      filtered = filtered.filter((product) => product.rating >= 4.5);
    } else {
      // Filter by collection
      const collection = collectionList.value.find(
        (c) => c.id === selectedCategory.value
      );
      if (collection) {
        filtered = filtered.filter((product) =>
          collection.productIds.includes(product.id)
        );
      }
    }
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.productTitle.toLowerCase().includes(query) ||
        product.productDescription.toLowerCase().includes(query)
    );
  }

  // Sort products
  switch (sortOption.value) {
    case "Lowest Price":
      filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      break;
    case "Highest Price":
      filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      break;
    case "Top Customer Reviews":
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default: // Most Recent
      // For demo, keep original order
      break;
  }

  return filtered;
});

// Helper functions
function getProductPrice(product) {
  if (product.basePrice > 0) {
    return product.basePrice;
  } else if (product.variationList && product.variationList.length > 0) {
    return product.variationList[0].price;
  }
  return 0;
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatSalesCount(count) {
  return new Intl.NumberFormat("en-US").format(count);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getRandomCartCount(productId) {
  return cartCounts.value[productId] || 0;
}

function getRandomDeliveryDate() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + 1);

  const end = new Date(today);
  end.setDate(today.getDate() + 10);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = start.toLocaleString("en-US", { month: "short" });

  return `${month} ${startDay}-${endDay}`;
}

function hasMultipleOptions(product) {
  return product.variationList && product.variationList.length > 1;
}

function getCategoryTitle() {
  if (selectedCategory.value === "all") {
    return "All Items";
  } else if (selectedCategory.value === "best-sellers") {
    return "Best Sellers";
  } else {
    const category = categories.value.find(
      (c) => c.id === selectedCategory.value
    );
    return category ? category.name : "Products";
  }
}
</script>

<style scoped>
.shop-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Graphik Webfont", -apple-system, "Helvetica Neue", sans-serif;
}

/* Shop Header Styles */
.shop-name {
  font-size: 26px;
  font-weight: 500;
  color: #222;
}

.shop-avatar {
  border-radius: 50%;
  overflow: hidden;
}

.shop-tagline {
  color: #595959;
}

.star-seller-badge {
  display: flex;
  align-items: center;
}

.sales-count {
  color: #595959;
}

.follow-shop-btn {
  width: 100%;
  max-width: 200px;
  border-radius: 24px;
}

.metric-card {
  background-color: #f5f5f5;
  border-radius: 6px;
  height: 100%;
}

/* Announcement Section */
.announcement-card {
  background-color: #f5f5f5;
  border-radius: 6px;
}

/* Navigation Tabs */
.navigation-tabs {
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: right;
  align-items: center;
  .nav-tab {
    margin-right: 250px;
  }
}

.search-input {
  max-width: 300px;
  float: right;
  margin-bottom: 16px;
}

/* Categories Sidebar */
.categories-sidebar {
  border-right: 1px solid #e1e1e1;
  padding-right: 16px;
}

.active-category {
  background-color: #f5f5f5;
  font-weight: 500;
}

/* Product Cards */
.product-card {
  transition: all 0.2s ease;
  height: 100%;
}

.product-card:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #222;
}

.rating-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #222;
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-title {
  font-size: 14px;
  color: #222;
  line-height: 1.4;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8em;
}

.options-badge {
  border-radius: 12px;
  font-size: 12px;
  padding: 2px 8px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .shop-metrics {
    margin-top: 16px;
  }

  .categories-sidebar {
    border-right: none;
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
}
</style>
