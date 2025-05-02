<template>
  <q-dialog v-model="model">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Thêm địa chỉ</div>
      </q-card-section>

      <q-card-section class="dialog-section2-container">
        <div class="label">Họ và tên người nhận</div>
        <q-input
          class="input-1"
          dense
          v-model="addressForm.recipientName"
          outlined
        />

        <div class="label">Địa chỉ</div>
        <div class="select-address-container">
          <q-select
            dense
            outlined
            :model-value="selectedProvince"
            :options="provinces"
            label="Tỉnh/ Thành phố"
            class="select-all"
            @update:model-value="
              $emit('update:selected-province', $event);
              testValue();
            "
          />
          <q-select
            dense
            outlined
            :model-value="props.selectedDistrict"
            :options="districts"
            label="Quận/ Huyện"
            class="select-all"
            @update:model-value="$emit('update:selected-district', $event)"
          />

          <q-select
            dense
            outlined
            :model-value="props.selectedWard"
            :options="wards"
            label="Xã/ Phường/ Thị trấn"
            class="select-all"
          />
        </div>
        <div class="label">Địa chỉ chi tiết</div>
        <q-input
          type="textarea"
          v-model="addressForm.specificAddress"
          label="Hãy nhập chi tiết địa chỉ để thuận tiện hơn trong việc lấy hàng"
          outlined
          class="q-mt-sm"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Save"
          color="primary"
          @click="emit('save')"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import { onBeforeMount, onMounted } from "vue";

const reviewProvince = ref("");
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  provinces: {
    type: Array,
    required: true,
  },
  districts: {
    type: Array,
    required: true,
  },
  wards: {
    type: Array,
    required: true,
  },
  selectedProvince: {
    type: Object,
    default: null,
  },
  selectedDistrict: {
    type: Object,
    default: null,
  },
  selectedWard: {
    type: Object,
    default: null,
  },
  addressForm: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "update:selected-province",
  "update:selected-district",
  "save",
]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

onMounted(() => {
  console.log("Initial selectedProvince:", props.selectedProvince);
});

function testValue() {
  console.log("Current selectedProvince:", props.selectedProvince);
}
</script>

<style scoped>
.dialog-section2-container {
  padding: 20px 40px;
}

.label {
  margin-right: 20px;
  font-size: 16px;
  color: rgb(75, 75, 75);
}

.input-1 {
  width: 300px;
  margin-bottom: 20px;
}

.select-address-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.select-all {
  flex: 1;
}
</style>
