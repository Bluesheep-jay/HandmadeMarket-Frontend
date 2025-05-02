<template>
    <div class="row items-center q-mb-md">
      <q-avatar size="32px" class="q-mr-sm">
        <img :src="shop.shopAvatarUrl" />
      </q-avatar>
      <div class="text-subtitle1">{{ shop.shopName }}</div>
      <q-space />
      <q-btn flat color="primary" label="..." />
    </div>
  </template>
  
  <script setup>
  defineProps({
    shop: {
      type: Object,
      required: true
    }
  });
  </script>
  
  