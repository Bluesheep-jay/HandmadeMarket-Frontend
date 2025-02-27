<template>
  <div class="step1-container">
    <div>
      <div class="field-container-all">
        <div class="label-all">Tên cửa hàng</div>
        <div class="input-container-all">
          <q-input
            dense
            outlined
            class="input-all"
            v-model="formData.shopName"
            label="Shop name *"
            :rules="[(val) => !!val || 'Tên shop không để trống']"
          />
        </div>
      </div>

      <div class="field2-container pickup-address">
        <div class="field2-pickup-address field-container-all">
          <div class="field2-label label-all">Địa chỉ lấy hàng</div>
          <div class="input-container-all">
            <button class="add-btn" @click="showAddressDialog = true">
              Thêm
            </button>
            <div v-if="formData.wardId" class="pickup-address-display q-mt-sm">
              <div class="">{{ addressForm.fullName }},</div>
              <div>{{ addressForm.province.label }},</div>
              <div>{{ addressForm.district.label }},</div>
              <div>{{ addressForm.ward.label }},</div>
              <div>{{ addressForm.specificAddress }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="field-container-all">
        <div class="label-all">Số điện thoại</div>
        <div class="input-container-all">
          <q-input
            class="input-all"
            dense
            outlined
            v-model="formData.phoneNumber"
            label="Phone number *"
            :rules="[
              (val) =>
                !!val ||
                'Số điện thoại phải là chính chủ, và chưa được sử dụng trước đó',
            ]"
            mask="(###) ###-####"
          />
        </div>
      </div>
      <div class="field-container-all">
        <div class="label-all">Email</div>
        <div class="input-container-all">
          <q-input
            class="input-all"
            dense
            outlined
            v-model="formData.email"
            label="Email *"
            :rules="[
              (val) => !!val || 'Email không để trống',
              (val) => isValidEmail(val) || 'Sai định dạng email',
            ]"
            type="email"
          />
        </div>
      </div>
    </div>

    <div class="btn-save-container q-mt-lg">
      <q-btn
        class="btn-save"
        @click="$emit('next')"
        label="Tiếp tục"
        :disable="!isFormValid"
      />
    </div>

    <q-dialog v-model="showAddressDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Add Pickup Address</div>
        </q-card-section>

        <q-card-section class="dialog-section2-container">
          <div class="label">Họ và tên</div>
          <q-input
            class="input-1"
            dense
            v-model="addressForm.fullName"
            outlined
          />

          <div class="label">Địa chỉ</div>
          <div class="select-address-container">
            <q-select
              dense
              outlined
              v-model="addressForm.province"
              :options="provinces"
              label="Tỉnh/ Thành phố"
              class="select-all"
              @update:model-value="fetchDistricts"
            />
            <q-select
              dense
              outlined
              v-model="addressForm.district"
              :options="districts"
              label="Quận/ Huyện"
              class="select-all"
              @update:model-value="fetchWards"
            />
            <q-select
              dense
              outlined
              v-model="addressForm.ward"
              :options="wards"
              label="Xã/  Phường/ Thị trấn"
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
            @click="saveAddress"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from "vue";

import ghnService from "../services/ghn.service";

const props = defineProps(["formData"]);
const emit = defineEmits(["next"]);

const showAddressDialog = ref(false);
const addressForm = ref({
  fullName: "",
  province: null,
  district: null,
  ward: null,
  specificAddress: "",
});

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

onBeforeMount(() => {
  fetchProvinces();
});

async function fetchProvinces() {
  const data = await ghnService.getProvince();
  provinces.value = data.data.map((province) => ({
    label: province.ProvinceName,
    value: province.ProvinceID,
  }));
}

async function fetchDistricts(province) {
  const data = await ghnService.getDistrict(province.value);

  districts.value = data.data.map((district) => ({
    label: district.DistrictName,
    value: district.DistrictID,
  }));
}

const fetchWards = async (district) => {
  const data = await ghnService.getWard(district.value);

  wards.value = data.data.map((ward) => ({
    label: ward.WardName,
    value: ward.WardCode,
  }));
};

//  **Watch để reset ward khi province thay đổi**
watch(
  () => addressForm.value.province,
  (newProvince) => {
    addressForm.value.district = null;
    addressForm.value.ward = null;
    districts.value = [];
    wards.value = [];
    if (newProvince) {
      fetchDistricts(newProvince);
    }
  }
);

//  **Watch để reset ward khi district thay đổi**
watch(
  () => addressForm.value.district,
  (newDistrict) => {
    addressForm.value.ward = null;
    wards.value = [];
    if (newDistrict) {
      fetchWards(newDistrict);
    }
  }
);

const saveAddress = () => {
  props.formData.fullName = addressForm.value.fullName;
  props.formData.provinceId = addressForm.value.province.value;
  props.formData.districtId = addressForm.value.district.value;
  props.formData.wardId = addressForm.value.ward.value;
  props.formData.specificAddress = addressForm.value.specificAddress;
};

const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

const isFormValid = computed(() => {
  return (
    props.formData.shopName &&
    props.formData.phoneNumber &&
    props.formData.email &&
    isValidEmail(props.formData.email)
  );
});
</script>

<style scoped>
.step1-container {
  padding: 0 30px 0 50px;
  .field-container-all {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .label-all {
      flex: 1;
      margin-right: 20px;
      text-align: right;
      font-size: 16px;
      color: rgb(75, 75, 75);
    }
    .input-container-all {
      flex: 6;
    }
    .input-all {
      width: 400px;
      padding: 0;
    }
  }

  .field2-container {
    .field2-pickup-address {
      .add-btn {
        border: none;
        border: 1px solid rgb(170, 170, 170);
        border-radius: 4px;
        background-color: white;

        padding: 5px 15px;
      }
      .add-btn:hover {
        border: 1px solid rgb(100, 100, 100);
        font-weight: 600;
        border-radius: 4px;
        padding: 5px 14px;
      }
    }
  }

  .btn-save-container {
    text-align: center;
    .btn-save {
      padding: 10px 20px;
      background: var(--btn);
      color: white;
    }
  }
}
.dialog-section2-container {
  padding: 20px 40px;
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
    .select-all {
      flex: 1;
    }
  }
}
</style>
