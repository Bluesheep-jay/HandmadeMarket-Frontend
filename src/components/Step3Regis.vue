<template>
  <div class="step3-container">
    <q-icon class="icon" name="verified" />
    <div class="logo">Bạn đã hoàn tất việc đăng ký cửa hàng</div>
    <div class="congratulation-text">
      Hãy đăng bán sản phẩm đầu tiên để khởi đầu hành trình bán hàng cùng HMM
      nào
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps(["formData"]);
defineEmits(["back", "submit"]);
</script>

<style scoped>
.step3-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon {
    font-size: 160px;
    color: var(--btn);
    margin-bottom: 30px;
  }
  .logo {
    font-size: 25px;
    margin-bottom: 10px;
    font-weight: 600;
    text-align: center;
  }
  .congratulation-text {
    font-size: 17px;
    color: rgb(50, 50, 50);
    text-align: center;
  }
}
</style>
