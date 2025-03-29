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
      <div class="cate-container">
        <q-select
          v-for="(category, index) in selectedCategories"
          :key="index"
          dense
          outlined
          v-model="selectedCategories[index]"
          :options="categoryOptions[index]"
          option-label="categoryName"
          option-value="id"
          emit-value
          map-options
          :label="'Phân loại cấp ' + (index + 1)"
          class="cate-input"
          @update:model-value="(value) => fetchSubCategories(index, value)"
        />
      </div>
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

    <div class="form-group" v-if="hasPersonalization" >
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
import { onBeforeMount, ref, watch } from "vue";
import categoryService from "../services/category.service";

const props = defineProps({ productData: Object });

const hasPersonalization = ref(false);
const selectedCategories = ref([]);
const categoryOptions = ref([]);

onBeforeMount(async () => {
  try {
    props.productData.shopId = localStorage.getItem("shopId");
    const rootCategories = await categoryService.getRootCategory();
    categoryOptions.value.push(rootCategories);
    selectedCategories.value.push("");
  } catch (error) {
    console.log(error);
  }
});

async function fetchSubCategories(index, selectedCategoryId) {
  try {
    console.log();
    // Xóa các danh mục cấp thấp hơn nếu chọn lại cấp trên
    selectedCategories.value = selectedCategories.value.slice(0, index + 1);
    categoryOptions.value = categoryOptions.value.slice(0, index + 1);

    // Gọi API lấy danh mục con
    const subCategories = await categoryService.getSubCategories(
      selectedCategoryId
    );

    if (subCategories.length > 0) {
      categoryOptions.value.push(subCategories);
      selectedCategories.value.push("");
    } else {
      props.productData.categoryId = selectedCategories.value[index];
    }
  } catch (error) {
    console.log(error);
  }
}

function togglePersonalization() {
  hasPersonalization.value = !hasPersonalization.value;
  
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
    .cate-container {
      display: flex;
      gap: 10px;
      .cate-input {
        width: 250px;
        padding: 0.75rem;
        /* border: 1px solid #e1e1e1;
        border-radius: 6px;
        font-size: 16px; */
      }
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
