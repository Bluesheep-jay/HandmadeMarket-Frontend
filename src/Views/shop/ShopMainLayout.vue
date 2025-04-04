<template>
  <q-layout view="hHh Lpr lff">
    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="!drawer || miniState"
      @click.capture="drawerClick"
      :width="240"
      :breakpoint="500"
      bordered
    >
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn
          class="collapse-btn"
          dense
          round
          unelevated
          icon="chevron_left"
          @click="collapseHandler"
        />
      </div>
      <q-item class="logo-container" to="/customer">
        <div :class="['logo', { 'collapsed-logo': miniState }]">Hmm</div>
      </q-item>

      <q-list padding>
        <q-expansion-item expand-separator default-opened>
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar size="35px" class="avatar" v-if="shopInfo">
                <img
                  :src="
                    shopInfo.shopAvatarUrl ||
                    'https://cdn.quasar.dev/img/avatar.png'
                  "
                  alt=""
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Quản Lý Tài Khoản</q-item-label>
            </q-item-section>
          </template>

          <q-list class="q-pl-lg">
            <q-item clickable v-ripple to="/shop">
              <q-item-section>Thông tin cửa hàng</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/shop/identify">
              <q-item-section>Thông tin thuế và định danh</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/shop/address">
              <q-item-section>Thông tin địa chỉ</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="inventory_2"
          label="Quản Lý Đơn Hàng"
          default-opened
        >
          <q-list class="q-pl-lg">
            <q-item clickable v-ripple to="/shop/order-management">
              <q-item-section>Đơn chờ duyệt và hoàn thành</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/shop/canceled-order-management">
              <q-item-section
                >Đơn Trả hàng/Hoàn tiền hoặc Đơn hủy</q-item-section
              >
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="point_of_sale"
          label="Giao dịch và doanh thu"
          default-opened
        >
          <q-list class="q-pl-lg">
            <q-item clickable v-ripple to="/shop/transaction-management">
              <q-item-section>Giao dịch</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/shop/revenue-management">
              <q-item-section>Thống kê</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Quản Lý Sản Phẩm -->
        <q-expansion-item
          expand-separator
          icon="category"
          label="Quản Lý Sản Phẩm"
        >
          <q-list class="q-pl-lg">
            <q-item clickable v-ripple to="/shop/products">
              <q-item-section>Tất Cả Sản Phẩm</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/shop/add-products">
              <q-item-section>Thêm Sản Phẩm</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Marketing Channel -->
        <q-expansion-item
          expand-separator
          icon="campaign"
          label="Kênh Marketing"
        >
          <q-list class="q-pl-lg">
            <q-item clickable v-ripple to="/shop/voucher-management">
              <q-item-section>Mã giảm giá</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Kênh Marketing</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";

import shopService from "../../services/shop.service";

const leftDrawerOpen = ref(true);

const shopId = localStorage.getItem("shopId");
const shopInfo = ref(null);

onBeforeMount(async () => {
  shopInfo.value = await shopService.getById(shopId);
});

const drawer = ref(false);
const miniState = ref(null);
function drawerClick(e) {
  if (miniState.value) {
    miniState.value = false;
    e.stopPropagation();
  }
}

function collapseHandler() {
  miniState.value = true;
}
</script>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    font-size: 35px;
    color: var(--icon);
  }
  .collapsed-logo {
    font-size: 21px;
    font-weight: 600;
    padding: 10px;
    color: var(--icon);
  }
}
.collapse-btn {
  background: var(--icon);
  color: white;
}
</style>
