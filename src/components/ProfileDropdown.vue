<template>
  <q-btn-dropdown
    mini-fab
    rounded
    dense
    class="profile-dropdown"
    dropdown-icon="none"
  >
    <template v-slot:label>
      <q-avatar size="32px" v-if="userInfo">
        <img
          :src="userInfo.avatarUrl || 'https://cdn.quasar.dev/img/avatar.png'"
          alt=""
        />
      </q-avatar>
    </template>

    <q-list class="profile-menu" style="min-width: 220px">
      <q-item
        class="profile-header q-py-md"
        clickable
        v-ripple
        @click="goToProfile"
      >
        <q-item-section avatar v-if="userInfo">
          <q-avatar size="40px">
            <img
              :src="
                userInfo?.avatarUrl || 'https://cdn.quasar.dev/img/avatar.png'
              "
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ userInfo.username }}</q-item-label>
          <q-item-label caption>Xem tài khoản</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Menu Items -->
      <q-item clickable v-ripple to="/customer/order-and-review">
        <q-item-section avatar>
          <q-icon class="icon" name="rate_review" />
        </q-item-section>
        <q-item-section>Đơn hàng và đánh giá</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="chat" />
        </q-item-section>
        <q-item-section>Tin nhắn</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="card_giftcard" />
        </q-item-section>
        <q-item-section>Đơn hàng đặt biệt</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="settings" />
        </q-item-section>
        <q-item-section>Cài đặt tài khoản</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        class="text-negative"
        @click="clearLocalStorage"
        to="/login"
      >
        <q-item-section avatar>
          <q-icon class="icon" name="exit_to_app" />
        </q-item-section>
        <q-item-section>Đăng xuất</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
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
  localStorage.setItem("userEmail", userEmail.value);
  userInfo.value = await usersService.getUserByEmail(userEmail.value);
  localStorage.setItem("userRole", userInfo.value.enumRole);
  localStorage.setItem("cartId", userInfo.value.cartId);
  localStorage.setItem("userId", userInfo.value.id);
});

function clearLocalStorage() {
  localStorage.clear();
}
function goToProfile() {
  router.push("/customer/profile");
}
</script>

<style scoped>
.profile-dropdown {
  .q-btn-dropdown__arrow {
    display: none;
  }
}

.profile-menu {
  border-radius: 8px;

  .icon {
    /* color: var(--icon); */
  }
  .profile-header {
    padding: 12px 16px;
  }

  .q-item {
    min-height: 40px;
    padding: 8px 16px;
    font-size: 14px;

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }
  }

  .q-separator {
    margin: 4px 0;
  }

  .text-negative {
    color: #d32f2f;

    .q-icon {
      color: #d32f2f;
    }
  }
}
</style>
