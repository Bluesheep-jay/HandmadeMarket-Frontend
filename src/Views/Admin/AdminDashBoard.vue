<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="text-h4 q-mb-md">Admin Dashboard</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <ThemeManager />
          </div>
          <div class="col-12 col-md-6">
            <SeasonProduct />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ThemeManager from "./ThemeManager.vue";
import SeasonProduct from "./SeasonProduct.vue";
</script>
