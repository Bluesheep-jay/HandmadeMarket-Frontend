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
</style>
