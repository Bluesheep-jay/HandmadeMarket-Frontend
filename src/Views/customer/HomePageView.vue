<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="page-container">
      <section class="q-pa-md">
        <div class="row q-col-gutter-md items-stretch">
          <div class="col-12 col-md-8 d-flex">
            <router-link
              :to="`/customer/product-list/${mugLevel2Id}`"
              class="clickable-card flex-grow-1"
            >
              <q-img
                src="../../assets/img/coffecup2.jpg"
                spinner-color="primary"
                class="rounded-borders full-height"
              />
              <div class="overlay-text-left">
                <div class="text-h4">Cốc mới, hương vị mới!</div>
                <div class="text-h6 q-mb-lg text-2">Mua sắm cùng Hmm</div>
                <q-btn label="Mua ngay" no-caps class="start-btn" />
              </div>
            </router-link>
          </div>

          <div class="col-12 col-md-4 d-flex">
            <router-link
              to="/birthflower-gifts"
              class="clickable-card flex-grow-1"
            >
              <q-img
                src="../../assets/img/flag2.jpg"
                spinner-color="primary"
                class="rounded-borders full-height"
              />
              <div class="overlay-text">
                <div class="text-h5 text-white"></div>
                <div class="text-subtitle text-white">
                  Mừng lễ lớn, ưu đãi lớn
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <section class="q-pa-md gift-section-container">
        <div class="q-mt-xl q-px-md">
          <div class="text-h5 text-weight-bold q-mb-md">
            Có thể bạn sẽ thích
          </div>

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
                v-for="(item, index) in recommendedProductList"
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
      </section>

      <!--Home Decor-->
      <section class="q-pa-md gift-section-container">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6 flex flex-center">
            <div>
              <div class="text-caption text-grey-7">Editors’ Khan</div>
              <div class="text-h5 text-weight-bold">Trang trí nhà cổ điển</div>
              <p class="text-body1 text-grey-8">
                Cổ nhưng không cũ cùng với Hmm
              </p>
              <q-btn
                label="Tìm thêm sản phẩm"
                unelevated
                rounded
                color="grey-3"
                text-color="black"
                class="q-mt-md"
                :to="`/customer/product-list/${HomeDecorRootId}`"
              />
            </div>
          </div>

          <div
            v-for="(item, index) in homeDecorProductList.slice(0, 2)"
            :key="item.id"
            class="col-6 col-sm-3"
          >
            <q-card class="product-card">
              <div class="image-container" @click="navigateToProduct(item)">
                <q-img
                  :ratio="1"
                  :src="item.imageList[0]"
                  spinner-color="primary"
                  class="rounded-borders gift-for-him-img"
                />
                <div class="price-overlay">
                  <div class="price-text">
                    {{
                      item.basePrice > 0
                        ? formatPrice(item.basePrice)
                        : formatPrice(item.variationList[0].price)
                    }}
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    icon="favorite_border"
                    class="heart-btn"
                    @click.stop="toggleFavorite(item, $event)"
                  />
                </div>
              </div>
            </q-card>
          </div>

          <!-- Phần dưới -->
          <div
            v-for="(item, index) in homeDecorProductList.slice(2, 6)"
            :key="item.id"
            class="col-6 col-sm-3"
          >
            <q-card class="product-card">
              <div class="image-container" @click="navigateToProduct(item)">
                <q-img
                  :ratio="1"
                  :src="item.imageList[0]"
                  spinner-color="primary"
                  class="rounded-borders gift-for-him-img"
                />
                <div class="price-overlay">
                  <div class="price-text">
                    {{
                      item.basePrice > 0
                        ? formatPrice(item.basePrice)
                        : formatPrice(item.variationList[0].price)
                    }}
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    icon="favorite_border"
                    class="heart-btn"
                    @click.stop="toggleFavorite(item, $event)"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </section>

      <!-- Jewelry   ------>
      <section class="jewelry-section-container q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6 flex flex-center">
                <div>
                  <div class="text-caption text-grey-7">
                    Người biên tập: Khan
                  </div>
                  <div class="text-h5 text-weight-bold">Trang sức của bạn</div>
                  <p class="text-body1 text-grey-8">
                    Những món trang sức làm tăng sức hút cho phái đẹp
                  </p>
                  <q-btn
                    label="Tìm thêm sản phẩm"
                    unelevated
                    rounded
                    color="grey-3"
                    text-color="black"
                    class="q-mt-md"
                  />
                </div>
              </div>

              <!-- 2 ảnh trên -->
              <div
                v-for="(item, index) in jewelryProductList.slice(0, 2)"
                :key="item.id"
                class="col-6 col-md-3"
              >
                <q-card class="product-card">
                  <div class="image-container" @click="navigateToProduct(item)">
                    <q-img
                      :ratio="1"
                      :src="item.imageList[0]"
                      spinner-color="primary"
                      class="rounded-borders"
                    />
                    <div class="price-overlay">
                      <div class="price-text">
                        {{
                          item.basePrice > 0
                            ? formatPrice(item.basePrice)
                            : formatPrice(item.variationList[0].price)
                        }}
                      </div>
                      <q-btn
                        flat
                        round
                        dense
                        icon="favorite_border"
                        class="heart-btn"
                        @click.stop="toggleFavorite(item, $event)"
                      />
                    </div>
                  </div>
                </q-card>
              </div>

              <!-- 4 ảnh dưới -->
              <div
                v-for="(item, index) in jewelryProductList.slice(2, 6)"
                :key="item.id"
                class="col-6 col-md-3"
              >
                <q-card class="product-card">
                  <div class="image-container" @click="navigateToProduct(item)">
                    <q-img
                      :src="item.imageList[0]"
                      class="rounded-borders"
                      :ratio="1"
                    />
                    <div class="price-overlay">
                      <div class="price-text">
                        {{
                          item.basePrice > 0
                            ? formatPrice(item.basePrice)
                            : formatPrice(item.variationList[0].price)
                        }}
                      </div>
                      <q-btn
                        flat
                        round
                        dense
                        icon="favorite_border"
                        class="heart-btn"
                        @click.stop="toggleFavorite(item, $event)"
                      />
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Bên phải (4 phần) -->
          <div class="col-12 col-md-4" v-if="jewelryProductList[6]">
            <q-card class="product-card q-card-jewelry-7">
              <div class="image-container" @click="navigateToProduct(item)">
                <q-img
                  :src="jewelryProductList[6].imageList[0]"
                  class="jewelry-img-7 rounded-borders"
                  :ratio="1"
                />

                <div class="price-overlay">
                  <div class="price-text">
                    {{
                      jewelryProductList[6].basePrice > 0
                        ? formatPrice(jewelryProductList[6].basePrice)
                        : formatPrice(
                            jewelryProductList[6].variationList[0].price
                          )
                    }}
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    icon="favorite_border"
                    class="heart-btn"
                    @click.stop="toggleFavorite(item, $event)"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </section>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import productService from "../../services/product.service";
import categoryService from "../../services/category.service";
import productRecommendationService from "../../services/productRecommendation.service";
import usersService from "../../services/users.service";

const route = useRoute();
const router = useRouter();
const mugLevel2Id = ref("67d6d68408c2b2be565f55c0");
const jewelryRootId = ref("67d83e2fa1ef96f019be7102");
const HomeDecorRootId = ref("67dd80ecc338f4c49ee91f4f");

const userRole = localStorage.getItem("userRole");
const userId = localStorage.getItem("userId");
const categoryRootList = ref([]);
const jewelryProductList = ref([]);
const homeDecorProductList = ref([]);
const recommendedProductList = ref([]);
const similarProductsRef = ref(null);

onBeforeMount(async () => {
  categoryRootList.value = await categoryService.getRootCategory();

  jewelryProductList.value = await productService.getAllByCategoryRootId(
    jewelryRootId.value
  );

  homeDecorProductList.value = await productService.getAllByCategoryRootId(
    HomeDecorRootId.value
  );

  const tempRecommendedProduct =
    await productRecommendationService.getByCollaborativeFilter(userId);
  recommendedProductList.value = tempRecommendedProduct.recommended_products;

  console.log(recommendedProductList.value);
});

const scrollCarousel = (type, direction) => {
  const ref =
    type === "similar" ? similarProductsRef.value : diverseProductsRef.value;
  if (ref) {
    const scrollAmount = ref.offsetWidth * 0.8 * direction;
    ref.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

const navigateToProduct = (product) => {
  router.push(`/customer/product-detail/${product.id || product._id}`);
};

const getProductPrice = (product) => {
  if (product.base_price > 0) {
    return product.base_price;
  } else if (product.variation_list && product.variation_list.length > 0) {
    return product.variation_list[0].price;
  }
  return 0;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

const toggleFavorite = (product) => {
  console.log("toggleFavorite", product);
  usersService.addToWishList(userId, product.id);
};
</script>

<style scoped>
.page-container {
  padding: 0 50px;

  .product-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .product-item {
      width: calc(100% / 5 - 10px);
      margin-bottom: 16px; /* Tạo khoảng cách giữa các dòng */
    }

    @media (max-width: 1024px) {
      .product-item {
        width: calc(
          100% / 3 - 10px
        ); /* 3 sản phẩm trên 1 dòng khi màn hình nhỏ hơn */
      }
    }

    @media (max-width: 768px) {
      .product-item {
        width: calc(
          100% / 2 - 10px
        ); /* 2 sản phẩm trên 1 dòng khi màn hình nhỏ hơn */
      }
    }

    @media (max-width: 480px) {
      .product-item {
        width: 100%; /* 1 sản phẩm trên 1 dòng khi màn hình rất nhỏ */
      }
    }
  }

  .product-card {
    transition: all 0.3s ease;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .gift-section-container,
  .jewelry-section-container {
    padding-top: 40px;

    .q-card-jewelry-7 {
      height: 100%;
      .jewelry-img-7 {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.clickable-card {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 300px;
}

.full-height {
  height: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.overlay-text-left {
  position: absolute;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  padding: 50px 20px 15px 20px;
  border-top-left-radius: 5px;
  border-bottom-right-radius: 5px;
  color: white;
  .text-2 {
    margin-left: 20px;
    margin-bottom: 40px;
  }
}
.overlay-text {
  position: absolute;
  bottom: 0px;
  width: 100%;
  /* left: 10px; */
  /* right: 10px; */
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 0 15px 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  .text-subtitle {
    font-weight: 600;
    font-size: 20px;
  }
}

.d-flex {
  display: flex;
}

.left-picture {
  background-image: url("D:\HandmadeMarket Project\frontend\src\assets\img\Handmade White Porcelain Vase.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.flex-grow-1 {
  flex-grow: 1;
}

.start-btn {
  width: fit-content;
  padding: 10px 20px;
  color: var(--icon);
  background-color: white;
  font-size: 18px;
  font-weight: 600;
  border: 1px solid white;
}

.carousel-container {
  position: relative;
  padding: 0 20px;
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
  display: none;
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

.image-container {
}
.price-overlay {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 8px;
}

.price-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.heart-btn {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
