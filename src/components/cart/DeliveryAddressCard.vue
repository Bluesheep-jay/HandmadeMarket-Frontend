<template>
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Địa chỉ giao hàng</div>
  
        <div v-if="addresses.length > 0" class="q-mb-md">
          <q-item v-for="(address, index) in addresses" :key="index">
            <div class="address-container">
              <q-radio
                :class="{
                  'selected-radio': selectedAddress === address.id,
                }"
                @click="$emit('select-address', address.id)"
                class="address-1"
                v-model="localSelectedAddress"
                :val="address.id"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :label="formatAddress(address)"
              />
              <div class="address-btn-container">
                <q-btn
                  unelevated
                  fab-mini
                  class="address-btn"
                  @click="$emit('remove-address', address.id)"
                  icon="location_off"
                />
              </div>
            </div>
          </q-item>
        </div>
  
        <q-btn
          label="Thêm địa chỉ"
          class="full-width q-mb-md add-address-btn"
          @click="$emit('add-address')"
          icon="add"
        />
      </q-card-section>
    </q-card>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    addresses: {
      type: Array,
      required: true
    },
    selectedAddress: {
      type: String,
      default: null
    }
  });
  
  const emit = defineEmits(['select-address', 'remove-address', 'add-address']);
  const localSelectedAddress = ref(props.selectedAddress);
  
  watch(() => props.selectedAddress, (newVal) => {
    localSelectedAddress.value = newVal;
  });
  
  function formatAddress(address) {
    return `${address.recipientName} - ${address.specificAddress}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`;
  }
  </script>
  
  <style scoped>
  .selected-radio {
    background-color: #e0f7fa;
    border-radius: 8px;
    padding: 5px 0 5px 10px;
    transition: background-color 0.3s;
  }
  
  .address-container {
    display: flex;
    gap: 5px;
  }
  
  .address-btn-container {
    display: flex;
    align-items: center;
  }
  
  .address-btn {
    color: black;
    padding: auto;
  }
  
  .address-btn:hover {
    cursor: pointer;
    background: rgba(255, 0, 0, 0.514);
    font-size: 15px;
  }
  
  .add-address-btn {
    background: var(--icon);
    color: white;
  }
  </style>
  
  