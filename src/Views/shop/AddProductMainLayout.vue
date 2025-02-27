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
    </div>

    <div class="right-item">
      <div
        v-for="(section, index) in sectionsList"
        :key="index"
        ref="sections"
        class="section"
        :id="`section-${index}`"
      >
        <component :is="section.component" :productData="productData"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount } from "vue";
import AboutSection from "../../components/AboutSection.vue";
import PhotoSection from "../../components/PhotoSection.vue";
import PriceInvention from "../../components/PriceInvention.vue";
import ShippingSection from "../../components/ShippingSection.vue";

const navItems = [
  { label: "Thông tin cơ bản" },
  { label: "Hình ảnh và video" },
  { label: "Số lượng và giá" },
  { label: "Vận chuyển" },
];

const sectionsList = [
  { component: AboutSection },
  { component: PhotoSection },
  { component: PriceInvention },
  { component: ShippingSection },
];

const sections = ref([]);
const activeSection = ref(0);

const productData = ref({
  productTitle: "",
  categoryId: "",
  productDescription: "",
  personalizationDescription: "",
  imageList: [],
  basePrice: 0,
  baseQuantity: 0,
  variationList: [],
  weight: "",
  length: "",
  width: "",
  height: "",
  shopId: ""
});

 
const scrollToSection = async (index) => {
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
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.container {
  display: flex;
  /* max-width: 1200px; */
  /* margin: 0 auto; */
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
  /* padding: 2rem 0; */
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
