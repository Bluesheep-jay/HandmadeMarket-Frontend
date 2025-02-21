<script>
import { useAuthStore } from './stores/auth';

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

<style scoped>

</style>
