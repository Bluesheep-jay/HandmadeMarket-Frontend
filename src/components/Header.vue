<template>
  <div>
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="toolbar-container">
        <q-btn dense flat class="logo" label="Hmm" no-caps to="/customer" />

        <!-- Categories Dropdown -->
        <q-btn-dropdown flat label="Danh mục" class="">
          <q-list>
            <q-item
              v-for="category in listCagtegory"
              :key="category.id"
              clickable
              v-close-popup
            >
              <q-item-section>{{ category.categoryName }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Search Bar -->
        <q-input
          rounded
          borderless
          v-model="searchText"
          placeholder="Nhập để tìm kiếm sản phẩm ..."
          class="search-input"
        >
          <template v-slot:append>
            <q-icon class="search-icon" name="search" />
          </template>
        </q-input>

        <!-- Action Icons -->
        <div class="action-icon-container">
          <q-btn class="icon" flat round icon="favorite" />
          <q-btn class="icon" flat round icon="card_giftcard" />
          <q-btn class="icon" flat round icon="notifications_none" />
          <q-btn class="icon" flat round icon="shopping_cart" />
          <ProfileDropdown />
          <q-btn
            class="icon"
            flat
            round
            icon="store"
            to="/customer/store-registration"
          />
        </div>
      </q-toolbar>

      <!-- Secondary Navigation -->
      <q-toolbar class="q-py-none">
        <div class="row full-width justify-start q-gutter-x-md">
          <q-btn flat no-caps label="Gifts" icon="redeem" />
          <q-btn flat no-caps label="Valentine's Day Gifts" />
          <q-btn flat no-caps label="Home Favorites" />
          <q-btn flat no-caps label="Fashion Finds" />
          <q-btn flat no-caps label="Registry" />
        </div>
      </q-toolbar>
    </q-header>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";

import ProfileDropdown from "./ProfileDropdown.vue";

import categoryService from "../services/category.service";

const searchText = ref("");
const listCagtegory = ref([]);

onBeforeMount(async () => {
  try {
    listCagtegory.value = await categoryService.getAll();
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped>
.toolbar-container {
  .logo {
    font-size: 35px;
    color: var(--icon);
  }

  .search-input {
    margin-left: 10px;
    width: 100%;
    border: 2px solid var(--icon);
    border-radius: 30px;
    padding: 0 9px 0 20px;
    .search-icon {
      background: var(--icon);
      color: white;
      border-radius: 50%;
      padding: 8px;
    }
  }

  .action-icon-container {
    margin-left: 30px;
    margin-right: 10px;
    min-width: fit-content;
    display: flex;
    gap: 10px;

    .icon {
      /* color: var(--icon); */
    }
  }
}
</style>
