<template>
  <div v-if="filteredVouchers.length > 0">
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-pa-sm">
        <q-expansion-item
          icon="local_offer"
          label="Mã giảm giá của Shop"
          header-class="text-primary"
          dense
        >
          <q-card>
            <q-card-section class="q-pa-sm">
              <div v-for="(voucher, index) in filteredVouchers" :key="index">
                <q-item dense>
                  <div class="address-container">
                    <q-radio
                      @click="$emit('select-shop-voucher', voucher)"
                      :class="{
                        'selected-radio': selectedShopVoucherId === voucher.id,
                      }"
                      class="address-1"
                      v-model="localSelectedVoucherId"
                      :val="voucher.id"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      :label="`${voucher.code} (Giảm ${formatPrice(voucher.discountValue)})`"
                    />
                  </div>
                </q-item>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { formatPrice } from '../../utils/formatters';

const props = defineProps({
  vouchers: {
    type: Array,
    required: true
  },
  selectedShopVoucherId: {
    type: String,
    default: null
  },
  shopTotalPrice: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['select-shop-voucher']);
const localSelectedVoucherId = ref(props.selectedShopVoucherId);

// Filter vouchers: only ACTIVE and with minOrderValue <= shopTotalPrice
const filteredVouchers = computed(() => {
  return props.vouchers.filter(voucher => 
    voucher.status === "ACTIVE" && 
    voucher.minOrderValue <= props.shopTotalPrice
  );
});

watch(() => props.selectedShopVoucherId, (newVal) => {
  localSelectedVoucherId.value = newVal;
});
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
</style>

