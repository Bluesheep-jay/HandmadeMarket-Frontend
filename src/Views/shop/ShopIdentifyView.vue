<template>
  <div class="container" v-if="shopInfo">
    <div class="content-container">
      <div class="title">Thông tin thuế và định danh người dùng</div>

      <div class="field-container">
        <div class="label-container">
          <span class="required">*</span>
          <span class="label-text">Loại hình kinh doanh</span>
        </div>
        <div class="business-type-container input-container q-gutter-x-md">
          <q-radio
            v-model="shopInfo.businessType"
            val="individual"
            label="Cá nhân"
            color="primary"
          />
          <q-radio
            v-model="shopInfo.businessType"
            val="household"
            label="Hộ kinh doanh"
            color="primary"
          />
          <q-radio
            v-model="shopInfo.businessType"
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
            v-model="shopInfo.taxCode"
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
            v-model="shopInfo.idNumber"
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
            v-model="shopInfo.idFullName"
            placeholder="Nhập họ và tên đầy đủ"
            :rules="[(val) => !!val || 'Họ và tên là bắt buộc']"
            outlined
            dense
          />
        </div>
      </div>

      <div class="id-img-container">
        <div class="item">
          <div class="label-container">
            <span class="required">*</span>
            <span class="label-text">Ảnh mặt trước CMND/CCCD</span>
          </div>
          <q-file
            class="file-input"
            v-model="idFrontImgFile"
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

        <div class="item">
          <div class="label-container">
            <span class="required">*</span>
            <span class="label-text">Ảnh mặt sau CMND/CCCD</span>
          </div>
          <q-file
            class="file-input"
            v-model="idBackImgFile"
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
      </div>
      <div class="field-container">
        <div class="label-container"></div>
        <div class="input-container">
          <div class="input-container">
            <q-btn
              label="Cập nhật thay đổi"
              @click="saveProfile"
              class="save-btn"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";

import shopService from "../../services/shop.service";
import cloudinaryService from "../../services/cloudinary.service";

const { notify } = useNotification();

const shopId = localStorage.getItem("shopId");
const shopInfo = ref(null);
const idFrontImagePreview = ref(null);
const idBackImagePreview = ref(null);
const idFrontImgFile = ref(null);
const idBackImgFile = ref(null);

onBeforeMount(async () => {
  try {
    shopInfo.value = await shopService.getById(shopId);
    idFrontImagePreview.value = shopInfo.value.idFrontImageUrl;
    idBackImagePreview.value = shopInfo.value.idBackImageUrl;
  } catch (error) {
    console.log(error);
  }
});

const handleImageUpload = (type) => {
  const file = type === "front" ? idFrontImgFile.value : idBackImgFile.value;
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

const saveProfile = async () => {
  try {
    notify({
      title: "Success",
      text: "Cập nhật thành công!",
      type: "success",
      duration: 1000,
    });
    if (idFrontImgFile.value) {
      const uploadedFrontImg = await cloudinaryService.uploadImage(
        idFrontImgFile.value
      );
      shopInfo.value.idFrontImageUrl = uploadedFrontImg;
    }
    if (idBackImgFile.value) {
      const uploadedBackImg = await cloudinaryService.uploadImage(
        idBackImgFile.value
      );
      shopInfo.value.idBackImageUrl = uploadedBackImg;
    }

    const res = await shopService.updateInfo(shopInfo.value.id, shopInfo.value);
  } catch (error) {
    console.log(error);
    notify({
      title: "Error",
      text: "Cập nhật thất bại!",
      type: "error",
      duration: 2000,
    });
  }
};
</script>

<style scoped>
.container {
  background-color: var(--acc-bg);
  height: 100vh;
  padding: 20px 40px;
  .content-container {
    background-color: white;
    /* border: 1px solid black; */
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

    padding-top: 20px;
    .title {
      text-align: center;
      font-size: 24px;
      margin-bottom: 30px;
      color: var(--icon);
    }

    .field-container {
      display: flex;
      width: 100%;
      gap: 25px;
      align-items: center;

      .label-container {
        flex: 2;
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

        .save-btn {
          background: var(--btn);
          color: white;
          font-weight: 600;
          margin-top: 20px;
        }
      }
    }

    .id-img-container {
      margin: 0 30px;
      /* border: 1px solid black; */
      margin-left: 80px;
      display: flex;
      justify-content: center;
      .item {
        flex: 1;
        .file-input {
          max-width: 400px;
        }
      }
    }
  }
}
</style>
