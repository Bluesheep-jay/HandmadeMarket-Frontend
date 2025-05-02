<script>
import { useAuthStore } from "./stores/auth";

export default {
  setup() {
    const authStore = useAuthStore();
    authStore.initializeToken();
  },
};
</script>

<template>
  <RouterView></RouterView>
  <notifications />
</template>

<style>
:root {
  --icon: #eb5b00;
  --btn: #118b50;;
  --acc-bg: rgb(200, 200, 200);
}
/* .text-orange-8 {
  color: #ff8c00 !important;
}

.bg-orange-8 {
  background-color: #ff8c00 !important;
}

.text-orange-3 {
  color: #ffcc80 !important;
}

.bg-orange-3 {
  background-color: #ffcc80 !important;
}

.text-orange-2 {
  color: #ffe0b2 !important;
}

.bg-orange-2 {
  background-color: #ffe0b2 !important;
} */
</style>
