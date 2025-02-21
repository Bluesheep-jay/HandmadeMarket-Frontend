<template>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2 q-mb-sm">Store Logo</div>
        <q-file
          v-model="formData.logo"
          label="Choose Logo"
          filled
          accept="image/*"
          @update:model-value="handleLogoUpload"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <q-img
          v-if="logoPreview"
          :src="logoPreview"
          class="q-mt-sm"
          style="max-width: 150px"
        />
      </div>
      <div class="col-12">
        <q-select
          v-model="formData.currency"
          :options="currencies"
          label="Store Currency *"
          filled
          :rules="[val => !!val || 'Currency is required']"
        />
      </div>
      <div class="col-12">
        <q-toggle
          v-model="formData.shippingEnabled"
          label="Enable Shipping"
        />
      </div>
      <div class="col-12 q-mt-md">
        <q-btn flat color="grey" @click="$emit('back')" label="Back" class="q-mr-sm" />
        <q-btn
          color="primary"
          @click="$emit('submit')"
          label="Submit"
          :disable="!formData.currency"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const props = defineProps(['formData']);
  defineEmits(['back', 'submit']);
  
  const logoPreview = ref(null);
  
  const currencies = [
    'USD - US Dollar',
    'EUR - Euro',
    'GBP - British Pound',
    'VND - Vietnamese Dong',
  ];
  
  const handleLogoUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        logoPreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  </script>
  
  