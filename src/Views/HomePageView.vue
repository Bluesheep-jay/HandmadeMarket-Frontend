<template>
  <q-layout view="hHh lpR fFf">
    
    <q-page-container class="page-container">
      <section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Left Side -->
          <div class="col-12 col-md-6">
            <div class="bg-orange-1 q-pa-xl rounded-borders">
              <div class="text-h3 q-mb-md" style="font-family: serif">
                Fresh fashion picks!
              </div>
              <div class="text-h6 q-mb-lg">
                Save on classic and trending style items
              </div>
              <q-btn color="black" label="Shop now" no-caps class="q-px-md" />
            </div>
          </div>
          <!-- Right Side -->
          <div class="col-12 col-md-6">
            <q-img
              :src="'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-35cytjzdV0QYaGUm4In7x2O0dXbWKr.png'"
              spinner-color="primary"
              style="height: 400px"
              class="rounded-borders"
            />
          </div>
        </div>
      </section>

      <!-- gift 4 him -->
      <section class="q-pa-md gift-section-container">
        <div class="row q-col-gutter-md">
          <!-- Phần trên -->
          <div class="col-12 col-md-6 flex flex-center">
            <div>
              <div class="text-caption text-grey-7">Editors’ Picks</div>
              <div class="text-h5 text-weight-bold">Quà cho chàng ấy</div>
              <p class="text-body1 text-grey-8">
                Shop original items that are perfect for all his passions.
              </p>
              <q-btn
                label="Shop these unique finds"
                unelevated
                rounded
                color="grey-3"
                text-color="black"
                class="q-mt-md"
              />
            </div>
          </div>

          <div
            v-for="(item, index) in listGiftForHim.slice(0, 2)"
            :key="item.id"
            class="col-6 col-md-3"
          >
            <q-card class="product-card">
              <q-img :src="item.img" class="gift-for-him-img" />
            </q-card>
          </div>

          <!-- Phần dưới -->
          <div
            v-for="(item, index) in listGiftForHim.slice(2, 6)"
            :key="item.id"
            class="col-6 col-sm-3"
          >
            <q-card class="product-card">
              <q-img
                :ratio="1"
                :src="item.img"
                spinner-color="primary"
                class="rounded-borders gift-for-him-img"
              />
            </q-card>
          </div>
        </div>
      </section>

      <!-- Jewelry   ------>
      <section class="jewelry-section-container q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Bên trái (7 phần) -->
          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-md">
              <!-- Phần tiêu đề -->
              <div class="col-12 col-md-6 flex flex-center">
                <div>
                  <div class="text-caption text-grey-7">Editors’ Picks</div>
                  <div class="text-h5 text-weight-bold">Trang sức của bạn</div>
                  <p class="text-body1 text-grey-8">
                    Shop original items that are perfect for all his passions.
                  </p>
                  <q-btn
                    label="Shop these unique finds"
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
                v-for="(item, index) in listJewelry.slice(0, 2)"
                :key="item.id"
                class="col-6 col-md-3"
              >
                <q-card class="product-card">
                  <q-img :src="item.img" class="jewelry-img" :ratio="1" />
                </q-card>
              </div>

              <!-- 4 ảnh dưới -->
              <div
                v-for="(item, index) in listJewelry.slice(2, 6)"
                :key="item.id"
                class="col-6 col-sm-3"
              >
                <q-card class="product-card">
                  <q-img :src="item.img" class="jewelry-img" :ratio="1" />
                </q-card>
              </div>
            </div>
          </div>

          <!-- Bên phải (4 phần) -->
          <div class="col-12 col-md-4">
            <q-card class="product-card q-card-jewelry-7">
              <q-img :src="listJewelry[6].img" class="jewelry-img-7" />
            </q-card>
          </div>
        </div>
      </section>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";

import categoryService from "../services/category.service";

import ProfileDropdown from "../components/ProfileDropdown.vue";
import WishListView from "./WishListView.vue";
import Header from "../components/Header.vue";

const listGiftForHim = ref([
  { id: 1, img: "https://cdn.quasar.dev/img/parallax1.jpg" },
  { id: 2, img: "https://cdn.quasar.dev/img/parallax2.jpg" },
  { id: 3, img: "https://cdn.quasar.dev/img/parallax1.jpg" },
  { id: 4, img: "https://cdn.quasar.dev/img/quasar.jpg" },
  { id: 5, img: "https://cdn.quasar.dev/img/mountains.jpg" },
  { id: 6, img: "https://cdn.quasar.dev/img/mountains.jpg" },
]);
const listJewelry = ref([
  { id: 1, img: "https://cdn.quasar.dev/img/parallax1.jpg" },
  { id: 2, img: "https://cdn.quasar.dev/img/parallax2.jpg" },
  { id: 3, img: "https://cdn.quasar.dev/img/parallax1.jpg" },
  { id: 4, img: "https://cdn.quasar.dev/img/quasar.jpg" },
  { id: 5, img: "https://cdn.quasar.dev/img/mountains.jpg" },
  { id: 6, img: "https://cdn.quasar.dev/img/mountains.jpg" },
  { id: 7, img: "https://cdn.quasar.dev/img/mountains.jpg" },
]);


</script>

<style scoped>
.page-container {
  padding: 0 50px;

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
</style>
