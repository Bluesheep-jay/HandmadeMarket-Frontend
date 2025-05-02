<template>
  <q-layout view="hHh lpR fFf">
    <Header></Header>

    <q-page-container>
      <router-view />
    </q-page-container>

      <Footer></Footer>
  </q-layout>
</template>

<script setup>
import Header from '../../components/Header.vue';
import Footer from '../../components/Footer.vue';
</script>
