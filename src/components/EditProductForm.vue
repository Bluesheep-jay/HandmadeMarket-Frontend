<template>
  <div class="container">
    <div class="left-item">
      <div
        v-for="(nav, index) in navItems"
        :key="nav.label"
        class="row-container"
        :class="{ active: activeSection === index }"
        @click="scrollToSection(index)"
      >
        <div>
          {{ nav.label }}
        </div>
      </div>
      <div class="btn-container">
        <button
          class="submit-btn"
          @click="submitHandler"
          :disabled="!isFormValid"
        >
          Submit
        </button>
      </div>
    </div>

    <div class="right-item">
      <div ref="sections" class="section" id="section-0">
        <AboutSection :productData="prop.productData" />
      </div>
      <div ref="sections" class="section" id="section-1">
        <EditPhotoSection :productData="prop.productData" ref="photoRef" />
      </div>
      <div ref="sections" class="section" id="section-2">
        <EditPriceInvention :productData="prop.productData" ref="priceRef" />
      </div>
      <div ref="sections" class="section" id="section-3">
        <ShippingSection :productData="prop.productData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { useQuasar } from "quasar";

import AboutSection from "./edit/EditAboutSection.vue";
import EditPhotoSection from "../components/edit/EditPhotoSection.vue";
import EditPriceInvention from "../components/edit/EditPriceInvention.vue";
import ShippingSection from "../components/ShippingSection.vue";
import shopService from "../services/shop.service";
import productService from "../services/product.service";

const emit = defineEmits(["update-success"]);
const prop = defineProps({ productData: Object });
const $q = useQuasar();
const loadingNotification = ref(null);
const { notify } = useNotification();
const navItems = [
  { label: "Thông tin cơ bản" },
  { label: "Hình ảnh và video" },
  { label: "Số lượng và giá" },
  { label: "Vận chuyển" },
];
const photoRef = ref(null);
const priceRef = ref(null);

const sections = ref([]);
const activeSection = ref(0);
const productData = ref(prop.productData);

async function submitHandler() {
  try {
    loadingNotification.value = $q.notify({
      group: false,
      message: "Đang cập nhật sản phẩm...",
      type: "ongoing",
      timeout: 0,
    });

    await priceRef.value.transferToVariationList();

    await priceRef.value.saveProductData();

    emit("update-success");
    await photoRef.value.uploadAllFile();

    if (productData.value.imageList.length == 0) {
      loadingNotification.value({
        message: "Vui lòng thêm hình ảnh cho sản phẩm",
        type: "negative",
        timeout: 2000,
      });
    } else {
      const res = await productService.updateProduct(
        productData.value.id,
        productData.value
      );
      loadingNotification.value({
        message: "Cập nhật thành công!",
        type: "positive",
        timeout: 2000,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const isFormValid = computed(() => {
  return (
    productData.value.productTitle.trim() !== "" &&
    productData.value.categoryId.trim() !== "" &&
    productData.value.productDescription.trim() !== ""
  );
});

const scrollToSection = (index) => {
  sections.value = document.querySelectorAll(".section");

  if (sections.value[index]) {
    sections.value[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    activeSection.value = index;
  }
};

const handleScroll = () => {
  const sectionElements = sections.value;
  if (!sectionElements.length) return;

  for (let i = 0; i < sectionElements.length; i++) {
    const element = sectionElements[i];
    const rect = element.getBoundingClientRect();

    if (rect.top <= 100 && rect.bottom >= 100) {
      activeSection.value = i;
      break;
    }
  }
};

onMounted(() => {
  sections.value = document.querySelectorAll(".section");
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.container {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: var(--acc-bg);
}

.left-item {
  position: sticky;
  top: 0;
  height: fit-content;
  flex: 1;
  padding: 1rem;
  background: white;
  border-radius: 8px;

  .btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      width: 100%;
      background: transparent;
      border: 2px solid #222;
      border-radius: 24px;
      font-weight: 600;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .submit-btn:hover {
      background: #222;
      background-color: var(--btn);
      color: white;
    }
  }
}

.row-container {
  display: flex;
  padding: 10px 0 16px 10px;
  font-size: 17px;
  color: rgb(120, 120, 120);
  transition: all 0.2s ease;
}

.row-container:hover {
  color: rgb(70, 70, 70);
  text-decoration: underline;
  cursor: pointer;
}

.row-container.active {
  color: rgb(34, 34, 34);
  font-weight: 500;
}

.right-item {
  flex: 5;
  background: white;
  border-radius: 8px;
  padding: 0 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section {
  border-bottom: 1px solid #e8e8e8;
}

.section:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .left-item {
    position: static;
    width: 100%;
  }
}
</style>
