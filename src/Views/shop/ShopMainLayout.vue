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
      <q-btn icon="chat" class="chat-btn" @click="openChatListDialog" />
    </q-page-container>

    <q-dialog v-model="chatListDialog">
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Danh sách người đã nhắn tin</div>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item
              v-for="partner in chatPartners"
              :key="partner.id"
              clickable
              @click="openChatWith(partner)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img
                    :src="partner.avatarUrl || 'https://cdn.quasar.dev/img/avatar.png'"
                    alt="Avatar"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ partner.username }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="negative" @click="closeChatDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <q-dialog v-model="chatDialog">
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Trò chuyện với người bán</div>
        </q-card-section>
        <q-card-section>
          <ChatComponent :receiver-id="selectedPartnerId" :currentUserId="shopId" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="negative" @click="closeChatDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";

import shopService from "../../services/shop.service";
import ChatComponent from "../../components/ChatComponent.vue";
import chatService from "../../services/chat.service";

const leftDrawerOpen = ref(true);
const chatDialog = ref(false);
const chatListDialog = ref(false);
const chatPartners = ref([]);
const shopId = localStorage.getItem("shopId");
const shopInfo = ref(null);
const drawer = ref(false);
const miniState = ref(null);
const selectedPartnerId = ref("")

onBeforeMount(async () => {
  shopInfo.value = await shopService.getById(shopId);
});
function drawerClick(e) {
  if (miniState.value) {
    miniState.value = false;
    e.stopPropagation();
  }
}

function collapseHandler() {
  miniState.value = true;
}

const openChatListDialog = async () => {
  chatListDialog.value = true;
  try {
    chatPartners.value = await chatService.getChatPartners(shopId);
    console.log(chatPartners.value);
  } catch (error) {
    console.error("Error fetching chat partners:", error);
  }
};

const openChatWith = (partner) => {
  selectedPartnerId.value = partner.id;
  chatDialog.value = true;
};
const closeChatDialog = () => {
  chatDialog.value = false;
};
</script>

<style scoped>
.chat-btn {
  background: var(--icon);
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Thêm hiệu ứng đổ bóng */
}
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
