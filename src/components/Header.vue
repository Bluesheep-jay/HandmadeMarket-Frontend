<template>
  <div class="header-container">
    <q-toolbar class="toolbar-container">
      <q-btn dense flat class="logo" label="Hmm" no-caps to="/customer" />

      <q-btn-dropdown flat label="Danh mục" class="">
        <q-list>
          <q-item
            v-for="category in categoryRootList"
            :key="category.id"
            clickable
            v-close-popup
          >
            <q-item-section>{{ category.categoryName }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <!-- Tìm kiếm-->
      <div class="search-input-container">
        <q-input
          rounded
          borderless
          v-model="searchTerm"
          placeholder="Search for products..."
          debounce="300"
          @update:model-value="fetchSuggestions"
          @keyup.enter="handleSearchByEnter"
          class="search-input"
        >
          <template v-slot:append>
            <q-icon class="search-icon" name="search" />
          </template>
        </q-input>
        <q-list v-if="suggestions.length" class="suggestion-list">
          <q-item
            v-for="(item, index) in suggestions"
            :key="index"
            clickable
            @click="handleSearchByClickItem(item)"
          >
            <q-item-section>{{ item }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Action Icons -->
      <div class="action-icon-container" v-if="token">
        <q-btn class="icon" flat round icon="favorite" to="/customer/profile" />
        <q-btn class="icon" flat round icon="card_giftcard" />
        <q-btn class="icon" flat round icon="notifications_none" />
        <q-btn
          class="icon"
          flat
          round
          icon="shopping_cart"
          to="/customer/cart"
        />
        <ProfileDropdown />
        <q-btn
          class="icon"
          flat
          round
          icon="store"
          to="/customer/store-registration"
        />
      </div>
      <div v-else class="login-btn-container">
        <q-btn class="btn-login" to="/login">Đăng nhập</q-btn>
        <q-btn class="btn-login" to="/register">Đăng ký</q-btn>
      </div>
    </q-toolbar>

    <!-- Secondary Navigation -->
    <q-toolbar class="q-py-none">
      <div class="row full-width justify-start q-gutter-x-md">
        <q-btn flat no-caps label="Quà tặng" icon="redeem" />
        <q-btn flat no-caps label="Bé cưng" />
        <q-btn flat no-caps label="Ngôi nhà của bạn" />
        <q-btn flat no-caps label="Trang phục " />
        <q-btn flat no-caps label="Sở thích" />
      </div>
    </q-toolbar>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import ProfileDropdown from "./ProfileDropdown.vue";

import categoryService from "../services/category.service";
import searchingService from "../services/searching.service";

const router = useRouter();
const searchTerm = ref("");
const suggestions = ref([]);
const categoryRootList = ref([]);
const token = ref(localStorage.getItem("token") || null);

onBeforeMount(async () => {
  try {
    categoryRootList.value = await categoryService.getRootCategory();
  } catch (error) {
    console.log(error);
  }
});

const handleSearchByEnter = () => {
  if (searchTerm.value.trim()) {
    router.push({
      path: "/customer/product-list",
      query: { q: searchTerm.value },
    });
  }
};

const handleSearchByClickItem = (item) => {
  searchTerm.value = item;
  router.push({ path: "/customer/product-list", query: { q: item } });
};

const fetchSuggestions = async () => {
  if (!searchTerm.value) {
    suggestions.value = [];
    return;
  }
  try {
    const response = await searchingService.search(searchTerm.value);
    suggestions.value = response;
    suggestions.value = suggestions.value.slice(0, 6);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
  }
};
</script>

<style scoped>
.header-container {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
.toolbar-container {
  .logo {
    font-size: 35px;
    color: var(--icon);
  }

  .search-input-container {
    position: relative;
    flex-grow: 1;
    margin: 0 15px;
    .search-input {
      width: 100%;

      margin-left: 10px;
      width: 100%;
      border: 2px solid var(--icon);
      border-radius: 30px;
      padding: 0 9px 0 20px;

      .search-icon {
        background: var(--icon);
        color: white;
        border-radius: 50%;
        padding: 5px;
      }
    }
    .suggestion-list {
      position: absolute;
      top: 70px;
      left: 0;
      width: 100%;
      padding-top: 10px;
      background: white;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      border-radius: 5px;
      z-index: 10;
    }
  }

  .action-icon-container {
    margin-left: 30px;
    margin-right: 10px;
    min-width: fit-content;
    display: flex;
    gap: 10px;
  }
}
.login-btn-container {
  margin-left: 20px;
}
.btn-login {
  border: none;
  background: none;
  /* border: 1px solid black; */
  border-radius: 20px;
  padding: 10px 20px;
  margin-right: 10px;
  background: var(--icon);
  color: white;
  font-size: 16px;
  font-weight: 600;
}
.btn-login:hover {
  cursor: pointer;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
</style>
