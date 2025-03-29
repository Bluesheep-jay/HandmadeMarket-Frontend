<template>
  <q-dialog v-model="showTransaction">
    <q-card class="q-pa-md text-center" style="width: 300px">
      <q-icon
        :name="isSuccess ? 'check_circle' : 'cancel'"
        :color="isSuccess ? 'blue' : 'red'"
        size="xl"
      />
      <div class="text-h6 q-mt-md">
        {{ isSuccess ? "GIAO DỊCH THÀNH CÔNG" : "GIAO DỊCH KHÔNG THÀNH CÔNG" }}
      </div>
      <div class="text-subtitle1 q-mt-sm">Số tiền thanh toán</div>
      <div
        class="text-h5 text-weight-bold"
        :class="isSuccess ? 'text-blue-10' : 'text-red'"
      >
        {{ formatCurrency(totalAmount) }}
      </div>
      <q-btn
        color="blue"
        class="q-mt-md"
        label="Tiếp tục mua sắm"
        to="/customer/cart"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import cartService from "../../services/cart.service";

const route = useRoute();
const showTransaction = ref(true);
const isSuccess = ref(false);
const totalAmount = ref(0);
const cartId = localStorage.getItem("cartId");

onMounted(async () => {
  const { paymentStatus, totalAmount: amount } = route.query;
  isSuccess.value = paymentStatus === "success";
  totalAmount.value = amount ? parseFloat(amount) : 0;
  totalAmount.value /=100
  if (isSuccess.value) {
    await cartService.clearCart(cartId);
  }
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
</script>
