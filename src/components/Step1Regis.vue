<template>
  <div class="step1-container">
    <div class="input-container">
      <div class="title">ĐẶT TÊN CHO CỬA HÀNG CỦA BẠN</div>
      <div class="description">
        Đừng lo lắng! Bạn có thể chỉ cần soạn thảo tên ngay bây giờ và thay đổi
        sau. Chúng tôi thấy người bán thường lấy cảm hứng từ những gì họ bán,
        phong cách của họ, hầu như mọi thứ đều ổn.
      </div>
      <q-input
        class="input-div"
        v-model="formData.storeName"
        label="Store Name *"
        :rules="[(val) => !!val || 'Store name is required']"
        outlined
      />
    </div>

    <div class="btn-save-container">
      <q-btn
        class="btn-save"
        @click="$emit('next')"
        label="Tiếp tục"
        :disable="!formData.storeName"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps(["formData"]);
defineEmits(["next"]);

const categories = [
  "Handmade Crafts",
  "Jewelry",
  "Art",
  "Clothing",
  "Home & Living",
  "Toys",
  "Vintage",
];
</script>

<style scoped>
.step1-container {
  .input-container {
    display: flex;
    align-items: center;
    .title {
      font-size: 30px;
      font-weight: 700;
    }
    .description {
      font-size: 17px;
      font-weight: 400;
      color: rgb(75, 75, 75);
      padding: 20px;
      width: 80%;
    }
    flex-direction: column;
    .input-div {
      width: 80%;
    }
  }
  .btn-save-container {
    display: flex;
    justify-content: center;
    .btn-save {
      background: #00215E;
      color: white;
    }
  }
}
</style>
