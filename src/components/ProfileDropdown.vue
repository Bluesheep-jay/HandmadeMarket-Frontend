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
          <q-item-label caption>View your profile</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Menu Items -->
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="rate_review" />
        </q-item-section>
        <q-item-section>Purchases and reviews</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="chat" />
        </q-item-section>
        <q-item-section>Messages</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="local_offer" />
        </q-item-section>
        <q-item-section>Special offers</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="card_giftcard" />
        </q-item-section>
        <q-item-section>Etsy Registry</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon class="icon" name="settings" />
        </q-item-section>
        <q-item-section>Account settings</q-item-section>
      </q-item>

      <q-item clickable v-ripple class="text-negative">
        <q-item-section avatar>
          <q-icon class="icon" name="exit_to_app" />
        </q-item-section>
        <q-item-section>Sign out</q-item-section>
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
  localStorage.setItem("userEmail", userEmail.value)
  userInfo.value = await usersService.getUserByEmail(userEmail.value);
});

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
