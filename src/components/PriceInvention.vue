<template>
  <div class="price-inventory-section">
    <h2 class="section-title">Số lượng và Giá</h2>
    <p class="section-description">
      Thiết lập giá và số lượng cho sản phẩm của bạn.
    </p>

    <!-- Basic pricing when no variations -->
    <div v-if="!hasVariations" class="form-group">
      <label for="price">Giá</label>
      <div class="price-input">
        <span class="currency">đ</span>
        <input
          id="price"
          v-model="price"
          type="number"
          min="0"
          step="1"
          class="form-input"
          placeholder="0.000"
        />
      </div>
    </div>

    <div v-if="!hasVariations" class="form-group">
      <label for="quantity">Số lượng</label>
      <div class="price-input">
        <input
          id="quantity"
          v-model="quantity"
          type="number"
          min="1"
          class="form-input"
          placeholder="Nhập số lượng sản phẩm"
        />
      </div>
    </div>

    <!-- Variations toggle -->
    <div class="form-group">
      <div class="switch-container">
        <label for="variations">Thêm các biến thể</label>
        <label class="switch">
          <input
            id="variations"
            v-model="hasVariations"
            type="checkbox"
            @change="toggleVariations"
          />
          <span class="slider"></span>
        </label>
      </div>
      <p class="helper-text">Thêm các tùy như kích cỡ, màu sắc (tối đa 2)</p>
    </div>

    <!-- Variations management -->
    <div v-if="hasVariations" class="variations-section">
      <!-- Variations list -->
      <div v-if="variations.length > 0" class="variations-list">
        <div
          v-for="(variation, index) in variations"
          :key="index"
          class="variation-item"
        >
          <div class="variation-header">
            <h3>{{ variation.name }}</h3>
            <p>{{ variation.options.length }} tùy chọn</p>
            <div class="variation-actions">
              <button class="icon-btn" @click="editVariation(index)">
                <span class="icon">✏️</span>
              </button>
              <button class="icon-btn" @click="removeVariation(index)">
                <span class="icon">🗑️</span>
              </button>
            </div>
          </div>
          <div class="variation-options">
            <span
              v-for="(option, optIndex) in variation.options"
              :key="optIndex"
              class="option-pill"
            >
              {{ option }}
            </span>
          </div>
        </div>
      </div>

      <!-- Add variation button -->
      <button
        v-if="variations.length < 2"
        class="add-variation-btn"
        @click="showVariationModal = true"
      >
        <span class="icon">+</span>
        Thêm biến thể
      </button>

      <!-- Variation combinations table -->
      <div v-if="variations.length > 0" class="combinations-section">
        <h5>Giá theo các biến thể</h5>
        <div v-if="variations.length === 1" class="variation-table">
          <div class="table-header">
            <div class="checkbox-cell"></div>
            <div class="name-cell">{{ variations[0].name }}</div>
            <div class="price-cell">Giá</div>
            <div class="quantity-cell">Số lượng</div>
            <div class="visible-cell">Hiển thị</div>
          </div>

          <div
            v-for="(option, index) in variations[0].options"
            :key="index"
            class="table-row"
          >
            <div class="checkbox-cell">
              <input
                type="checkbox"
                :id="`option-${index}`"
                v-model="selectedCombinations"
                :value="index"
              />
            </div>
            <div class="name-cell">{{ option }}</div>
            <div class="price-cell">
              <div class="price-input">
                <span class="currency">đ</span>
                <input
                  type="number"
                  v-model="singleVariationPrices[index]"
                  min="0"
                  class="form-input"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div class="quantity-cell">
              <input
                type="number"
                v-model="singleVariationQuantities[index]"
                min="0"
                class="form-input"
                placeholder="0"
              />
            </div>
            <div class="visible-cell">
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="singleVariationVisibility[index]"
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="variations.length === 2" class="variation-table">
          <div class="table-header">
            <div class="checkbox-cell"></div>
            <div class="name-cell">{{ variations[0].name }}</div>
            <div class="name-cell">{{ variations[1].name }}</div>
            <div class="price-cell">Giá</div>
            <div class="quantity-cell">Số lượng</div>
            <div class="visible-cell">Hiển thị</div>
          </div>

          <div
            v-for="(combination, index) in combinationsList"
            :key="index"
            class="table-row"
          >
            <div class="checkbox-cell">
              <input
                type="checkbox"
                :id="`combination-${index}`"
                v-model="selectedCombinations"
                :value="index"
              />
            </div>
            <div class="name-cell">{{ combination.option1 }}</div>
            <div class="name-cell">{{ combination.option2 }}</div>
            <div class="price-cell">
              <div class="price-input">
                <span class="currency">đ</span>
                <input
                  type="number"
                  v-model="combinationPrices[index]"
                  min="0"
                  class="form-input"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div class="quantity-cell">
              <input
                type="number"
                v-model="combinationQuantities[index]"
                min="0"
                class="form-input"
                placeholder="0"
              />
            </div>
            <div class="visible-cell">
              <label class="switch">
                <input type="checkbox" v-model="combinationVisibility[index]" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add variation modal -->
    <div v-if="showVariationModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Thêm biến thể</h3>

        <div class="form-group">
          <label for="variation-name">Tên biến thể</label>
          <input
            id="variation-name"
            v-model="newVariation.name"
            type="text"
            class="form-input"
            placeholder="Ví dụ: Kích cỡ, màu sắc, chất liệu"
          />
        </div>

        <div class="form-group">
          <label>Các tùy chọn</label>
          <div
            v-for="(option, index) in newVariation.options"
            :key="index"
            class="option-input"
          >
            <input
              type="text"
              v-model="newVariation.options[index]"
              class="form-input"
              :placeholder="`Option ${index + 1}`"
            />
            <button
              class="icon-btn"
              @click="removeOption(index)"
              v-if="newVariation.options.length > 1"
            >
              <span class="icon">🗑️</span>
            </button>
          </div>

          <button
            class="text-btn"
            @click="addOption"
            v-if="newVariation.options.length < 10"
          >
            <span class="icon">+</span> Thêm tùy chọn khác
          </button>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelVariation">Cancel</button>
          <button
            class="save-btn"
            @click="saveVariation"
            :disabled="
              !newVariation.name || newVariation.options.some((opt) => !opt)
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const price = ref("");
const quantity = ref(1);
const hasVariations = ref(false);

const variations = ref([]);
const showVariationModal = ref(false);
const newVariation = ref({
  name: "",
  options: [""],
});
const editingIndex = ref(-1);

const singleVariationPrices = ref([]);
const singleVariationQuantities = ref([]);
const singleVariationVisibility = ref([]);
const combinationPrices = ref([]);
const combinationQuantities = ref([]);
const combinationVisibility = ref([]);
const selectedCombinations = ref([]);

const combinationsList = computed(() => {
  if (variations.value.length !== 2) return [];

  const combinations = [];
  for (const option1 of variations.value[0].options) {
    for (const option2 of variations.value[1].options) {
      combinations.push({
        option1,
        option2,
      });
    }
  }
  return combinations;
});

watch(
  variations,
  () => {
    if (variations.value.length === 1) {
      singleVariationPrices.value = Array(
        variations.value[0].options.length
      ).fill("");
      singleVariationQuantities.value = Array(
        variations.value[0].options.length
      ).fill(1);
      singleVariationVisibility.value = Array(
        variations.value[0].options.length
      ).fill(true);
    } else if (variations.value.length === 2) {
      const totalCombinations =
        variations.value[0].options.length * variations.value[1].options.length;
      combinationPrices.value = Array(totalCombinations).fill("");
      combinationQuantities.value = Array(totalCombinations).fill(1);
      combinationVisibility.value = Array(totalCombinations).fill(true);
    }
  },
  { deep: true }
);

const toggleVariations = () => {
  if (!hasVariations.value) {
    variations.value = [];
  }
};

const addOption = () => {
  newVariation.value.options.push("");
};

const removeOption = (index) => {
  newVariation.value.options.splice(index, 1);
};

const saveVariation = () => {
  const filteredOptions = newVariation.value.options.filter(
    (opt) => opt.trim() !== ""
  );

  if (editingIndex.value >= 0) {
    // Update existing variation
    variations.value[editingIndex.value] = {
      name: newVariation.value.name,
      options: filteredOptions,
    };
  } else {
    // Add new variation
    variations.value.push({
      name: newVariation.value.name,
      options: filteredOptions,
    });
  }

  showVariationModal.value = false;
  resetNewVariation();
};

const cancelVariation = () => {
  showVariationModal.value = false;
  resetNewVariation();
};

const resetNewVariation = () => {
  newVariation.value = {
    name: "",
    options: [""],
  };
  editingIndex.value = -1;
};

const editVariation = (index) => {
  editingIndex.value = index;
  newVariation.value = JSON.parse(JSON.stringify(variations.value[index]));
  showVariationModal.value = true;
};

const removeVariation = (index) => {
  variations.value.splice(index, 1);
};
</script>

<style scoped>
.price-inventory-section {
  max-width: 800px;
}

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
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.price-input {
  position: relative;
  max-width: 200px;
}

.currency {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #595959;
}

.price-input .form-input {
  padding-left: 24px;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  font-size: 16px;
}

.form-input:focus {
  outline: none;
  border-color: #222;
}

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.helper-text {
  font-size: 14px;
  color: #595959;
  margin-top: 0.25rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #222;
}

input:checked + .slider:before {
  transform: translateX(24px);
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

.variations-section {
  margin-top: 1.5rem;
}

.variations-list {
  margin-bottom: 1.5rem;
}

.variation-item {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.variation-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.variation-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.variation-header p {
  margin: 0 0 0 1rem;
  color: #595959;
  font-size: 14px;
}

.variation-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
}

.icon-btn:hover {
  background: #f5f5f5;
}

.variation-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.option-pill {
  background: #f5f5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.option-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.text-btn {
  background: transparent;
  border: none;
  color: #222;
  padding: 0.5rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.text-btn:hover {
  text-decoration: underline;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #e1e1e1;
  padding: 0.75rem 1.5rem;
  border-radius: 24px;
  cursor: pointer;
}

.save-btn {
  background: #222;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 24px;
  cursor: pointer;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.combinations-section {
  margin-top: 2rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 1.5rem;
}

.combinations-section h5 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.variation-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  display: flex;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 0.75rem;
  font-weight: 500;
}

.table-row {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #e1e1e1;
}

.table-row:last-child {
  border-bottom: none;
}

.checkbox-cell {
  width: 40px;
  display: flex;
  align-items: center;
}

.name-cell {
  flex: 1;
  display: flex;
  align-items: center;
}

.price-cell {
  width: 150px;
  padding: 0 0.5rem;
}

.quantity-cell {
  width: 150px;
  padding: 0 0.5rem;
}

.visible-cell {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
