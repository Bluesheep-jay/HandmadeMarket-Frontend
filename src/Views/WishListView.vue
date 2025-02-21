<template>
  <div class="user-info-view q-pa-md">
    <!-- Header Section -->
    <div class="row items-center q-mb-lg" v-if="userInfo">
      <div class="col-grow">
        <div class="row items-center q-gutter-x-md">
          <!-- Avatar -->
          <q-avatar size="80px" class="bg-green-2" >
            <img
              :src="
                userInfo.avatarUrl || 'https://cdn.quasar.dev/img/avatar.png'
              "
              alt=""
            />
            <q-btn
              round
              flat
              dense
              icon="edit"
              class="absolute-bottom-right"
              size="sm"
            />
          </q-avatar>

          <!-- Title and Status -->
          <div>
            <div class="text-h5 q-mb-sm">{{ userInfo.username || userInfo.email }}</div>
            <div class="row items-center q-gutter-x-sm">
              <q-icon name="public" size="xs" />
              <span class="text-caption">Public</span>
              <span class="text-caption">1 item</span>
              <q-btn flat dense padding="none" label="Edit" color="primary" to="/profile-editing" />
            </div>
            <div class="text-caption q-mt-xs">
              Owner of
              <a href="#" class="text-primary">fz8wkngvcyn6aigm</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side Buttons -->
      <div class="col-auto">
        <div class="row q-gutter-x-md">
          <q-btn
            flat
            color="primary"
            label="Updates"
            class="q-px-md"
            icon-right="arrow_drop_down"
          />
          <q-btn
            outline
            color="primary"
            label="Create new"
            class="q-px-md"
            icon="add"
          />
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <q-input
          outlined
          dense
          v-model="searchText"
          placeholder="Search your favorites"
          class="search-input"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-auto q-ml-md">
        <div class="row items-center q-gutter-x-sm">
          <span class="text-body2">Group Favorites</span>
          <q-toggle v-model="groupFavorites" />
        </div>
      </div>
    </div>

    <!-- Product Card -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="product-card">
          <q-img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-abSIunkqE09ePaM6GuQ3NVxag7ZS3r.png"
            :ratio="1"
            class="product-image"
          />
          <q-card-section>
            <div class="row items-center q-gutter-x-xs">
              <q-rating
                v-model="rating"
                size="xs"
                :max="5"
                color="amber"
                readonly
              />
              <span class="text-caption">4.8</span>
            </div>
            <div class="text-subtitle1 q-mt-sm">
              Tan Leather Travel Watch Case, Men ...
            </div>
            <div class="text-h6 q-mt-sm">4,641,910₫</div>
            <div class="text-caption text-positive q-mt-xs">In 20+ carts!</div>
            <div class="text-caption q-mt-sm">
              Shipping: 397,878₫
              <br />
              Est. delivery: Feb 25-Mar 3
              <br />
              Returns: Accepted
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "vue-router";
import usersService from "../services/users.service";

const router = useRouter();
const token = localStorage.getItem("token");
const decoded = jwtDecode(token);

const userInfo = ref(null);
const userEmail = ref(decoded.sub);

onBeforeMount(async () => {
  userInfo.value = await usersService.getUserByEmail(userEmail.value);
  console.log(userInfo.value);
});
</script>

<style scoped>
.user-info-view {
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  max-width: 600px;
}

.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  cursor: pointer;
}

.absolute-bottom-right {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: white;
  border: 1px solid #ddd;
}
</style>
