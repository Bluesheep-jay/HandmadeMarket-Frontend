<template>
  <div class="about-section">
    <h2 class="section-title">Thông tin cơ bản</h2>

    <div class="form-group">
      <label for="title">Tên sản phẩm</label>
      <input
        id="title"
        v-model="productData.productTitle"
        type="text"
        class="form-input"
        placeholder="Bao gồm các từ khóa mà người mua sẽ sử dụng để tìm kiếm mặt hàng này."
      />
    </div>

    <div class="form-group">
      <label for="category">Phân loại sản phẩm</label>
      <select id="category" v-model="productData.categoryId" class="form-input">
        <option
          v-for="category in categoryList"
          :key="category.id"
          :value="category.id"
        >
          {{ category.categoryName }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="description">Mô tả sản phẩm</label>
      <textarea
        id="description"
        v-model="productData.productDescription"
        class="form-input"
        rows="6"
        placeholder="Điều gì làm cho mặt hàng của bạn trở nên đặc biệt? Người mua sẽ chỉ thấy một vài dòng đầu tiên trừ khi họ mở rộng mô tả."
      ></textarea>
    </div>

    <button class="add-variation-btn" @click="togglePersonalization">
      <span class="icon">+</span>
      {{
        hasPersonalization ? "Xóa tính cá nhân hóa" : "Thêm tính cá nhân hóa"
      }}
    </button>

    <div class="form-group" v-if="hasPersonalization">
      <label for="description">Hướng dẫn cho người mua</label>
      <textarea
        id="description"
        v-model="productData.personalizationDescription"
        class="form-input"
        rows="5"
        placeholder=" Nhập vào đây: Hướng dẫn cá nhân hóa mà bạn muốn người mua xem"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import categoryService from "../services/category.service";

const props = defineProps({ productData: Object });

const categoryList = ref([]);
const hasPersonalization = ref(false);

onBeforeMount(async () => {
  try {
    props.productData.shopId = localStorage.getItem("shopId");
    categoryList.value = await categoryService.getAll();
  } catch (error) {
    console.log(error);
  }
});

function togglePersonalization() {
  hasPersonalization.value = !hasPersonalization.value;
  // console.log(props.productData)
}
</script>

<style scoped>
.about-section {
  max-width: 800px;

  .section-title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .section-description {
    color: #595959;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;

    .form-input {
      width: 80%;
      padding: 0.75rem;
      border: 1px solid #e1e1e1;
      border-radius: 6px;
      font-size: 16px;
    }

    .form-input:focus {
      outline: none;
      border-color: #222;
    }
  }

  label {
    display: block;
    font-weight: 500;
    /* margin-bottom: 0.5rem; */
  }

  textarea.form-input {
    resize: vertical;
    min-height: 120px;
  }

  .add-variation-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: 2px solid #222;
    border-radius: 24px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 2rem;
  }

  .add-variation-btn:hover {
    background: #222;
    color: white;
  }
}
</style>
