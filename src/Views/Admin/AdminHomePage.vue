<template></template>

<script setup>
import { onBeforeMount, ref } from "vue";

import adminService from "../../services/admin.service";

const users = ref([]);
const shops = ref([]);
const waitingApprovalShops = ref([]);
const products = ref([]);
const transactions = ref([]);
const categories = ref([]);
const monthlyCommissionForYear = ref([]);
const monthlyRevenueForYear = ref(0);

onBeforeMount(async () => {
  try {
    users.value = await adminService.getAllUsers();
    monthlyRevenueForYear.value = await adminService.getTotalRevenueOfPlatform(
      3,
      2025
    );
    console.log("1. monthlyRevenueForYear.value: ", monthlyRevenueForYear.value);
    console.log("2. userData: ")
    console.log(users.value);
  } catch (error) {
    console.error("Error during onBeforeMount:", error);
  }
});
</script>
