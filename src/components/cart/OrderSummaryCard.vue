<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h6 q-mb-md">Phương thức thanh toán</div>
      <div class="row q-col-gutter-sm q-mb-lg">
        <q-list class="payment-container">
          <q-item
            v-for="(payment, index) in paymentMethods"
            :key="index"
            :class="{
              'selected-radio': selectedPayment === payment.id,
            }"
          >
            <div class="address-container">
              <q-radio
                class="address-1"
                v-model="localSelectedPayment"
                :val="payment.id"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :label="payment.methodName"
                @update:model-value="$emit('select-payment', payment.id)"
              />
            </div>
          </q-item>
        </q-list>
      </div>

      <!-- Order Summary -->
      <div class="row justify-between q-mb-sm">
        <div>Tổng giá</div>
        <div>{{ formatPrice(orderSummary.itemsTotal) }}</div>
      </div>
      <div class="row justify-between q-mb-sm">
        <div>Khuyến mãi</div>
        <div class="text-negative">-{{ formatPrice(discount) }}</div>
      </div>

      <div class="row justify-between q-mb-sm">
        <div>Phí vận chuyển</div>
        <div>{{ formatPrice(shippingFee) }}</div>
      </div>

      <q-separator />

      <div class="row justify-between q-py-md text-h6">
        <div>Số lượng ({{ shopCount }} đơn)</div>
        <div>{{ formatPrice(totalAmount) }}</div>
      </div>

      <q-separator />

      <!-- Checkout Button -->
      <q-btn
        color="black"
        label="Thanh toán"
        class="full-width q-mb-md"
        size="lg"
        @click="$emit('checkout')"
      />

      <!-- Platform Vouchers -->
      <q-expansion-item
        v-if="filteredVouchers.length > 0"
        icon="local_offer"
        label="Áp mã giảm giá của Sàn"
        header-class="text-primary"
        dense
      >
        <q-card>
          <q-card-section class="q-pa-sm">
            <q-item v-for="(voucher, index) in filteredVouchers" :key="index" dense>
              <div class="address-container">
                <q-radio
                  @click="$emit('select-platform-voucher', voucher)"
                  :class="{
                    'selected-radio': selectedVoucherId === voucher.id,
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
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { formatPrice } from '../../utils/formatters';

const props = defineProps({
  paymentMethods: {
    type: Array,
    required: true
  },
  selectedPayment: {
    type: String,
    default: null
  },
  orderSummary: {
    type: Object,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  shopCount: {
    type: Number,
    default: 0
  },
  vouchers: {
    type: Array,
    required: true
  },
  selectedVoucherId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['select-payment', 'select-platform-voucher', 'checkout']);
const localSelectedPayment = ref(props.selectedPayment);
const localSelectedVoucherId = ref(props.selectedVoucherId);

// Filter vouchers: only ACTIVE and with minOrderValue <= orderSummary.itemsTotal
const filteredVouchers = computed(() => {
  return props.vouchers.filter(voucher => 
    voucher.status === "ACTIVE" && 
    voucher.minOrderValue <= props.orderSummary.itemsTotal
  );
});

watch(() => props.selectedPayment, (newVal) => {
  localSelectedPayment.value = newVal;
});

watch(() => props.selectedVoucherId, (newVal) => {
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

.payment-container {
  padding-right: 20px;
  width: 100%;
}
</style>

