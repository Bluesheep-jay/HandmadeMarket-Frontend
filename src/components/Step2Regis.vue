<template>
  <div class="row q-col-gutter-md">
    <!-- Business Type -->
    <div class="field-container">
      <div class="label-container">
        <span class="required">*</span>
        <span class="label-text">Loại hình kinh doanh</span>
      </div>
      <div class="business-type-container input-container q-gutter-x-md">
        <q-radio
          v-model="formData.businessType"
          val="individual"
          label="Cá nhân"
          color="primary"
        />
        <q-radio
          v-model="formData.businessType"
          val="household"
          label="Hộ kinh doanh"
          color="primary"
        />
        <q-radio
          v-model="formData.businessType"
          val="company"
          label="Công ty"
          color="primary"
        />
      </div>
    </div>

    <!-- Tax Code -->
    <div class="field-container">
      <div class="label-container">
        <span class="required">*</span>
        <span class="label-text">Mã số thuế</span>
      </div>
      <div class="input-container">
        <q-input
          class="tax-input input"
          v-model="formData.taxCode"
          placeholder="Nhập mã số thuế"
          :rules="[
            (val) => !!val || 'Mã số thuế là bắt buộc',
            (val) => val.length >= 10 || 'Mã số thuế không hợp lệ',
          ]"
          outlined
          mask="#############"
          dense
        />
      </div>
    </div>

    <!-- ID Number -->
    <div class="field-container">
      <div class="label-container">
        <span class="required">*</span>
        <span class="label-text">Số CMND/CCCD</span>
      </div>
      <div class="input-container">
        <q-input
          class="id-input input"
          v-model="formData.idNumber"
          placeholder="Nhập số CMND/CCCD (12 chữ số)"
          :rules="[
            (val) => !!val || 'Số CMND/CCCD là bắt buộc',
            (val) => val.length === 12 || 'Số CMND/CCCD phải có 12 chữ số',
          ]"
          mask="############"
          outlined
          dense
        />
      </div>
    </div>

    <!-- Full Name -->
    <div class="field-container">
      <div class="label-container">
        <span class="required">*</span>
        <span class="label-text">Họ và tên (theo CMND/CCCD)</span>
      </div>
      <div class="input-container">
        <q-input
          class="id-name-input input"
          v-model="formData.idFullName"
          placeholder="Nhập họ và tên đầy đủ"
          :rules="[(val) => !!val || 'Họ và tên là bắt buộc']"
          outlined
          dense
        />
      </div>
    </div>

    <!-- ID Card Front Image -->
    <div class="col-12 col-md-6">
      <div class="label-container">
        <span class="required">*</span>
        <span class="label-text">Ảnh mặt trước CMND/CCCD</span>
      </div>
      <q-file
        v-model="formData.idFrontImageUrl"
        label="Chọn ảnh"
        outlined
        dense
        accept="image/*"
        @update:model-value="handleImageUpload('front')"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <q-img
        v-if="idFrontImagePreview"
        :src="idFrontImagePreview"
        class="q-mt-sm"
        style="max-width: 200px; max-height: 150px"
      />
    </div>

    <!-- ID Card Back Image -->
    <div class="col-12 col-md-6">
      <div class="label-container">
        <span class="required">*</span>
        <span class="label-text">Ảnh mặt sau CMND/CCCD</span>
      </div>
      <q-file
        v-model="formData.idBackImageUrl"
        label="Chọn ảnh"
        outlined
        dense
        accept="image/*"
        @update:model-value="handleImageUpload('back')"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <q-img
        v-if="idBackImagePreview"
        :src="idBackImagePreview"
        class="q-mt-sm"
        style="max-width: 200px; max-height: 150px"
      />
    </div>

    <!-- Buttons -->
    <div class="col-12 q-mt-xl">
      <div class="button-container">
        <q-btn
          flat
          color="grey-7"
          @click="$emit('back')"
          label="Quay lại"
          class="q-mr-sm"
        />
        <q-btn class="next-btn" @click="handleSaveAndNext" label="Tiếp tục" />
      </div>
      <!-- :disable="!isFormValid" -->
    </div>

    <!-- dialog confirm email otp -->

    <q-dialog v-model="otpDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Xác thực Email</div>
          <div>Vui lòng nhập mã OTP đã gửi đến email của bạn:</div>
          <q-input v-model="otpCode" label="Mã OTP" outlined dense />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Xác nhận" @click="confirmOtp" color="primary" />
          <q-btn
            label="Hủy"
            @click="otpDialog = false"
            color="secondary"
            flat
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from "vue";
import { useQuasar } from "quasar";
import shopService from "../services/shop.service";
import cloudinaryService from "../services/cloudinary.service";
import { useNotification } from "@kyvg/vue3-notification";
import emailService from "../services/email.service";

const { notify } = useNotification();
const userEmail = ref(localStorage.getItem("userEmail"));
const $q = useQuasar();
const props = defineProps(["formData"]);
const emit = defineEmits(["next", "back"]);
const loadingNotification = ref(null);

const idFrontImagePreview = ref(null);
const idBackImagePreview = ref(null);
const otpDialog = ref(false);
const otpCode = ref("");

const handleImageUpload = (type) => {
  const file =
    type === "front"
      ? props.formData.idFrontImageUrl
      : props.formData.idBackImageUrl;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "front") {
        idFrontImagePreview.value = e.target.result;
      } else {
        idBackImagePreview.value = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

async function handleSaveAndNext() {
  try {
    $q.loading.show({
      message: "Đang chờ xác thực, vui lòng đợi...",
      spinnerSize: 50,
    });

    const [frontImageUrl, backImageUrl] = await Promise.all([
      cloudinaryService.uploadImage(props.formData.idFrontImageUrl),
      cloudinaryService.uploadImage(props.formData.idBackImageUrl),
    ]);
    console.log("run1");
    props.formData.idFrontImageUrl = frontImageUrl;
    props.formData.idBackImageUrl = backImageUrl;

    const res = await emailService.sendEmail(userEmail.value);
    if (res.status === 200) {
      otpDialog.value = true;
    } else {
      notify({
        type: "error",
        title: "Lỗi",
        text: "Gửi mã OTP không thành công. Vui lòng thử lại.",
      });
    }
    $q.loading.hide();
  } catch (error) {
    console.log(error);
  }
}

const confirmOtp = async () => {
  try {
    const res = await emailService.verifyEmail(userEmail.value, otpCode.value);
    if (res.status === 200) {
      otpDialog.value = false;
      createShop();
    } else {
      $q.notify({
        type: "negative",
        message: "Mã OTP không hợp lệ. Vui lòng thử lại.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const createShop = async () => {
  try {
    loadingNotification.value = $q.loading.show({
      message: "Đang tạo cửa hàng, vui lòng đợi...",
      spinnerSize: 50,
    });

    const res = await shopService.createShop(props.formData);
    emit("next");

    $q.loading.hide();
  } catch (error) {
    console.log(error);
  }
};

const isFormValid = computed(() => {
  return (
    props.formData.businessType &&
    props.formData.taxCode &&
    props.formData.idNumber &&
    props.formData.idNumber.length === 12 &&
    props.formData.idFullName &&
    props.formData.idFrontImageUrl &&
    props.formData.idBackImageUrl
  );
});
</script>

<style scoped>
.field-container {
  display: flex;
  width: 100%;
  gap: 25px;
  align-items: center;
  .label-container {
    flex: 1;
    margin-bottom: 8px;
    text-align: right;

    .required {
      color: #ff4d4f;
      margin-right: 4px;
    }
    .label-text {
      font-size: 15px;
      color: rgb(75, 75, 75);
    }
  }

  .input-container {
    flex: 3;
    padding: 0;
    margin-bottom: 15px;

    .input {
      padding: 0;
    }
    .tax-input {
      width: 300px;
    }
    .id-input {
      width: 300px;
    }
    .id-name-input {
      width: 500px;
    }
  }
}

.button-container {
  display: flex;
  justify-content: center;
  .next-btn {
    background: var(--btn);
    color: white;
  }
}
</style>
