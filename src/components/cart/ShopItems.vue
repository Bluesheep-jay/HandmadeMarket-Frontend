<template>
  <div class="grouped-shop-container bg-grey-3 rounded-borders">
    <div v-for="item in shop.items" :key="item.productId">
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Product Image -->
            <div class="col-4 col-sm-2">
              <q-img
                :src="item.productImage"
                :ratio="1"
                class="rounded-borders"
              />
            </div>

            <!-- Product Details -->
            <div class="col-8 col-sm-10">
              <div class="product-title ellipsis">{{ item.productTitle }}</div>

              <div class="option-quantity-container">
                <div v-if="item.variationList" class="row">
                  <div
                    v-for="(value, key) in item.selectedOptions"
                    :key="key"
                    class="option-container q-mr-sm"
                  >
                    <div class="text-subtitle2">{{ key }} *</div>
                    <q-select
                      v-model="item.selectedOptions[key]"
                      :options="getAttributeOptions(item, key)"
                      outlined
                      dense
                      class="q-mt-sm"
                      @update:model-value="updateVariation(item)"
                    />
                  </div>

                  <div>
                    <div class="text-subtitle2">Số lượng *</div>
                    <q-select
                      v-model="item.quantity"
                      :options="getStockOptions(item)"
                      outlined
                      dense
                      class="q-mt-sm"
                      @update:model-value="$emit('update-quantity')"
                    />
                  </div>
                </div>
                <div v-if="item.personalizationRequired">
                  <div class="text-subtitle2">Tính cá nhân hóa *</div>

                  <q-input
                    class="personal-input q-mt-sm"
                    dense
                    outlined
                    hide-bottom-space
                    v-model="item.personalizationOfClient"
                    autogrow
                    :error="personalError"
                    :error-message="personalErrorMessage"
                  />
                  <div class="personalizationDescriptionOfProduct text-grey-8">
                    {{ item.personalizationDescriptionOfProduct }}
                  </div>
                </div>
              </div>

              <div class="text-price text-primary">
                {{ formatPrice(item.subPrice) }}
              </div>

              <q-btn
                class="remove-btn"
                flat
                label="Xóa"
                color="negative"
                @click="$emit('remove-item', item)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { formatPrice } from "../../utils/formatters";

const props = defineProps({
  shop: {
    type: Object,
    required: true,
  },
  shopIndex: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  "update-variation",
  "update-quantity",
  "remove-item",
]);

const personalError = ref(false);
const personalErrorMessage = ref("");

function getAttributeOptions(item, attribute) {
  return item.variationList
    .map((variation) => variation.attributes[attribute])
    .filter((value, index, self) => self.indexOf(value) === index);
}

function updateVariation(item) {
  emit("update-variation", item);
}

function getStockOptions(item) {
  updateVariation(item);
  return Array.from({ length: item.stock }, (_, i) => i + 1);
}
</script>

<style scoped>
.product-title,
.text-price {
  font-size: 17px;
  max-width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  position: absolute;
  right: 0;
  top: 0;
}

.option-quantity-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.grouped-shop-container {
  padding: 5px;
  padding-bottom: 0px;
  background: rgb(211, 211, 211);
  border: none;
  border: 1px solid white;
}

.personal-input {
  width: 240px;
}

.personalizationDescriptionOfProduct {
  width: 240px;
  font-size: 13px;
  word-wrap: normal;
  margin-left: 10px;
  text-decoration: underline;
}
</style>
