<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-orange-8 text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <div class="row items-center">
            <q-icon name="shopping_basket" size="28px" class="q-mr-sm" />
            HandmadeMarket Admin
          </div>
        </q-toolbar-title>

        <q-btn-dropdown flat icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="240"
      class="bg-white"
    >
      <q-list>
        <q-item-label header class="text-grey-8">Admin Panel</q-item-label>

        <q-item
          v-for="link in essentialLinks"
          :key="link.title"
          clickable
          :to="link.link"
          :active="link.link === $route.path"
          active-class="bg-orange-2 text-orange-9"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const leftDrawerOpen = ref(false);

const essentialLinks = [
  {
    title: "Tổng quan",
    caption: "tổng quan và thống kê",
    icon: "dashboard",
    link: "/admin/dashboard",
  },
  {
    title: "Sản phẩm",
    caption: "quản lý sản phẩm",
    icon: "inventory_2",
    link: "/admin/products",
  },

  {
    title: "Đơn hàng",
    caption: "Quản lý đơn hàng",
    icon: "shopping_cart",
    link: "/admin/orders",
  },
  {
    title: "Người dùng",
    caption: "Quản lý người dùng",
    icon: "people",
    link: "/admin/users",
  },
  {
    title: "Cửa hàng",
    caption: "Quản lý cửa hàng",
    icon: "store",
    link: "/admin/shops",
  },
  {
    title: "Danh mục",
    caption: "Quản lý danh mục",
    icon: "category",
    link: "/admin/categories",
  },
  {
    title: "Mã giảm giá",
    caption: "Quản lý mã giảm giá",
    icon: "card_giftcard",
    link: "/admin/vouchers",
  },

  {
    title: "Giao dịch",
    caption: "Lịch sử giao dịch",
    icon: "payments",
    link: "/admin/transactions",
  },
  {
    title: "Hoa hồng",
    caption: "Quản lý hoa hồng",
    icon: "payments",
    link: "/admin/commissions",
  },
  {
    title: "Cài đặt",
    caption: "Cài đặt hệ thống",
    icon: "settings",
    link: "/settings",
  },
];

const onLogout = () => {
  // Implement logout logic using your authentication service
  console.log("Logout clicked");
};
</script>

<style lang="scss" scoped>
// Custom styles
.q-drawer {
  .q-item {
    border-radius: 0 24px 24px 0;
    margin-right: 12px;
    margin-bottom: 4px;
  }

  .q-item.q-router-link--active {
    font-weight: 600;
  }
}
</style>
