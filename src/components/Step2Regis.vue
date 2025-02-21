<template>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
          v-model="formData.address"
          label="Store Address *"
          filled
          :rules="[val => !!val || 'Address is required']"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.city"
          label="City *"
          filled
          :rules="[val => !!val || 'City is required']"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.phone"
          label="Phone Number *"
          filled
          mask="(###) ###-####"
          :rules="[val => !!val || 'Phone number is required']"
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="formData.email"
          label="Store Email *"
          filled
          type="email"
          :rules="[
            val => !!val || 'Email is required',
            val => isValidEmail(val) || 'Invalid email format'
          ]"
        />
      </div>
      <div class="col-12 q-mt-md">
        <q-btn flat color="grey" @click="$emit('back')" label="Back" class="q-mr-sm" />
        <q-btn
          color="primary"
          @click="$emit('next')"
          label="Continue"
          :disable="!formData.address || !formData.city || !formData.phone || !formData.email"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps(['formData']);
  defineEmits(['next', 'back']);
  
  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };
  </script>
  
  