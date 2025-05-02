<template>
    <div class="price-filter q-mb-md">
      <q-expansion-item
        expand-separator
        icon="attach_money"
        label="Lọc theo giá"
        header-class="text-primary"
        default-opened
      >
        <q-card>
          <q-card-section class="q-pa-sm">
            <div class="row q-col-gutter-xs">
              <div 
                v-for="(range, index) in priceRanges" 
                :key="index"
                class="col-12"
              >
                <q-checkbox
                  v-model="selectedPriceRanges"
                  :val="index"
                  :label="range.label"
                  color="orange"
                  dense
                  class="text-caption"
                />
              </div>
            </div>
            
            <q-separator spaced inset class="q-my-xs" />
            
            <div class="row q-gutter-xs q-mt-xs">
              <q-input 
                v-model.number="customMinPrice" 
                type="number" 
                outlined 
                dense 
                label="Từ" 
                class="col"
                min="0"
                :rules="[val => val >= 0 || 'Giá không hợp lệ']"
                input-class="text-caption"
                label-slot
              >
                <template v-slot:label>
                  <div class="text-caption">Từ</div>
                </template>
              </q-input>
              <q-input 
                v-model.number="customMaxPrice" 
                type="number" 
                outlined 
                dense 
                label="Đến" 
                class="col"
                min="0"
                :rules="[val => val >= 0 || 'Giá không hợp lệ']"
                input-class="text-caption"
                label-slot
              >
                <template v-slot:label>
                  <div class="text-caption">Đến</div>
                </template>
              </q-input>
            </div>
            <q-btn 
              label="Áp dụng" 
              color="orange" 
              class="q-mt-xs full-width text-caption" 
              size="sm"
              @click="applyCustomPriceRange"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    products: {
      type: Array,
      required: true
    }
  });
  
  const emit = defineEmits(['filter-products']);
  
  // Định nghĩa các khoảng giá
  const priceRanges = [
    { label: 'Dưới 500.000 đ', min: 1000, max: 500000 },
    { label: '500.000 đ - 2.000.000 đ', min: 500000, max: 2000000 },
    { label: '2.000.000 đ - 10.000.000 đ', min: 2000000, max: 10000000 },
    { label: 'Trên 10.000.000 đ', min: 10000000, max: 50000000 }
  ];
  
  const selectedPriceRanges = ref([]);
  const customMinPrice = ref(null);
  const customMaxPrice = ref(null);
  
  // Theo dõi thay đổi của các khoảng giá đã chọn
  watch(selectedPriceRanges, () => {
    filterProducts();
  });
  
  // Lọc sản phẩm theo khoảng giá
  const filterProducts = () => {
    if (selectedPriceRanges.value.length === 0) {
      // Nếu không có khoảng giá nào được chọn, trả về tất cả sản phẩm
      emit('filter-products', props.products);
      return;
    }
  
    // Lọc sản phẩm theo các khoảng giá đã chọn
    const filteredProducts = props.products.filter(product => {
      // Lấy giá của sản phẩm
      let productPrice;
      if (product.variationList && product.variationList.length > 0) {
        productPrice = Math.min(...product.variationList.map(v => v.price));
      } else {
        productPrice = product.basePrice;
      }
  
      // Kiểm tra xem giá sản phẩm có nằm trong bất kỳ khoảng giá đã chọn nào không
      return selectedPriceRanges.value.some(rangeIndex => {
        const range = priceRanges[rangeIndex];
        return productPrice >= range.min && productPrice <= range.max;
      });
    });
  
    emit('filter-products', filteredProducts);
  };
  
  // Áp dụng khoảng giá tùy chỉnh
  const applyCustomPriceRange = () => {
    if (customMinPrice.value === null || customMaxPrice.value === null) {
      return;
    }
  
    // Đảm bảo min <= max
    const min = Math.min(customMinPrice.value, customMaxPrice.value);
    const max = Math.max(customMinPrice.value, customMaxPrice.value);
  
    // Lọc sản phẩm theo khoảng giá tùy chỉnh
    const filteredProducts = props.products.filter(product => {
      let productPrice;
      if (product.variationList && product.variationList.length > 0) {
        productPrice = Math.min(...product.variationList.map(v => v.price));
      } else {
        productPrice = product.basePrice;
      }
  
      return productPrice >= min && productPrice <= max;
    });
  
    emit('filter-products', filteredProducts);
  };
  </script>
  
  <style scoped>
  .price-filter {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  </style>