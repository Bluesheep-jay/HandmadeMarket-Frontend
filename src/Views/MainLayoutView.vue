<template>
  <q-layout view="hHh lpR fFf">
    <Header></Header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Header from '../components/Header.vue';
</script>
