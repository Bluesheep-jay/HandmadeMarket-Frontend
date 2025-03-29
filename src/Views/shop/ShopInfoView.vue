<template>
  <div class="container" v-if="shopInfo">
    <div class="content-container">
      <div class="title">Thông tin cơ bản</div>

      <div class="shop-avatar-container">
        <div class="field-container">
          <div class="avatar-container">
            <q-avatar size="150px">
              <img
                :src="
                  avatarReview ||
                  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5Br92ncNaJsaUNoh8yNkgHJk1uw3nW.png'
                "
              />
            </q-avatar>
          </div>
          <div class="file-container">
            <q-file
              class="file-input"
              outlined
              dense
              v-model="imageFile"
              label="Chọn logo cho shop"
              @update:model-value="handleImageUpload"
              accept=".jpg,.jpeg,.png,.gif"
              :rules="[
                (val) =>
                  !val || val.size <= 10485760 || 'File must be less than 10MB',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div class="text-caption text-grey">
              Ảnh có định dạng .jpg, .gif hoặc .png dung lượng nhỏ hơn 10MB.
            </div>
          </div>
        </div>
      </div>
      <div class="field-container">
        <div class="custom-text">Tên Shop</div>
        <div class="input-container">
          <q-input
            outlined
            v-model="shopInfo.shopName"
            dense
            class="username-input input"
          />
        </div>
      </div>

      <div class="field-container">
        <div class="custom-text custom-text-2">Mô tả</div>
        <div class="input-container">
          <q-input
            outlined
            v-model="shopInfo.shopDescription"
            dense
            type="textarea"
            class="phonenumber-input input"
          />
        </div>
      </div>

      <div class="field-container">
        <div class="custom-text"></div>
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
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";

import shopService from "../../services/shop.service";
import cloudinaryService from "../../services/cloudinary.service";

const { notify } = useNotification();

const shopId = localStorage.getItem("shopId");
const shopInfo = ref(null);
const imageFile = ref(null);
const avatarReview = ref(null);

onBeforeMount(async () => {
  try {
    shopInfo.value = await shopService.getById(shopId);
    avatarReview.value = shopInfo.value.shopAvatarUrl;
  } catch (error) {
    console.log(error);
  }
});

const handleImageUpload = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarReview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveProfile = async () => {
  try {
    if (imageFile.value) {
      const uploadedUrl = await cloudinaryService.uploadImage(imageFile.value);

      shopInfo.value.shopAvatarUrl = uploadedUrl;
    }

    const res = await shopService.updateInfo(shopInfo.value.id, shopInfo.value);
    notify({
      title: "Success",
      text: "Cập nhật thành công!",
      type: "success",
      duration: 2000,
    });
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
  background: var(--acc-bg);
  height: 100vh;
  padding: 30px 40px;
  .content-container {
    background: white;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    padding: 30px;
    .title {
      text-align: center;
      font-size: 24px;
      margin-bottom: 30px;
      color: var(--icon);
    }

    .field-container {
      display: flex;
      margin-bottom: 20px;
      .avatar-container {
        flex: 1;
        margin-right: 20px;
        text-align: right;
      }
      .file-container {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: end;
        .file-input {
          width: 200px;
        }
      }

      .custom-text {
        text-align: right;
        flex: 1;
        margin-right: 20px;
      }

      .input-container {
        flex: 6;
        .input {
          width: 500px;
        }
        .save-btn {
          background: var(--btn);
          color: white;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
