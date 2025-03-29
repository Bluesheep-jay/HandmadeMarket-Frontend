<template>
    <q-card class="seasonal-product-manager">
      <q-card-section>
        <div class="text-h6">Seasonal Product Manager</div>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="selectedSeason"
          :options="seasonOptions"
          label="Select Season"
          outlined
          emit-value
          map-options
          @update:model-value="updateSeasonalProducts"
        />
      </q-card-section>
      <q-card-section>
        <q-list bordered separator>
          <q-item v-for="product in seasonalProducts" :key="product.id">
            <q-item-section avatar>
              <q-avatar>
                <img :src="product.image">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ product.name }}</q-item-label>
              <q-item-label caption>{{ product.price }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="product.active" @update:model-value="updateProductStatus(product)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useProductStore } from './product'
  
  const productStore = useProductStore()
  
  const seasonOptions = [
    { label: 'All Year', value: 'all' },
    { label: 'Christmas', value: 'christmas' },
    { label: 'Lunar New Year', value: 'lunar-new-year' }
  ]
  
  const selectedSeason = ref('all')
  
  const seasonalProducts = computed(() => {
    return productStore.getProductsBySeason(selectedSeason.value)
  })
  
  const updateSeasonalProducts = (newSeason) => {
    selectedSeason.value = newSeason
  }
  
  const updateProductStatus = (product) => {
    productStore.updateProductStatus(product.id, product.active)
  }
  </script>
  
  