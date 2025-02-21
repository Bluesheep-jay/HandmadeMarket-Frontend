<template>
  <div class="q-pa-md">
    <q-card class="profile-editor">
      <q-card-section v-if="userData">
        <div class="row q-col-gutter-md">
          <!-- Profile Picture -->
          <div class="col-8 profile-picture-container">
            <div class="profile-picture-section">
              <q-avatar size="150px">
                <img
                  :src="
                    profileImage ||
                    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5Br92ncNaJsaUNoh8yNkgHJk1uw3nW.png'
                  "
                />
              </q-avatar>
              <div class="upload-section q-mt-sm">
                <div class="picture-title-container">
                  <div class="custom-text">Profile Picture</div>
                  <q-file
                    outlined
                    dense
                    v-model="imageFile"
                    label="Chọn tệp"
                    @update:model-value="handleImageUpload"
                    accept=".jpg,.jpeg,.png,.gif"
                    :rules="[
                      (val) =>
                        !val ||
                        val.size <= 10485760 ||
                        'File must be less than 10MB',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <div class="text-caption text-grey">
                  Ảnh có định dạng .jpg, .gif hoặc .png dung lượng nhỏ hơn 10MB.
                </div>
              </div>
            </div>
          </div>

          <!-- Name -->
          <div class="col-12 field-container">
            <div class="row items-center">
              <div class="custom-text col">Tên người dùng</div>
              <q-input
                outlined
                v-model="userData.username"
                dense
                class="username-input"
              />
            </div>
          </div>

          <div class="col-12 field-container">
            <div class="row items-center">
              <div class="custom-text col">Số điện thoại</div>
              <q-input
                outlined
                v-model="userData.phoneNumber"
                dense
                class="phonenumber-input"
              />
            </div>
          </div>

          <!-- Save Button -->
          <div class="save-btn">
            <q-btn
              color="primary"
              label="Save Changes"
              @click="saveProfile"
              class="q-mt-lg"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, reactive } from "vue";
import { useQuasar } from "quasar";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "@kyvg/vue3-notification";

import usersService from "../services/users.service";

const { notify } = useNotification();
const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const userEmail = ref(decoded.sub);

const imageFile = ref(null);
const profileImage = ref(null);
const cities = ref([]);
const months = ref([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);
const days = ref([...Array(31)].map((_, i) => (i + 1).toString()));

const userData = reactive({
  id: "",
  username: "",
  email: "",
  avatarUrl: "",
  enumRole: "",
  addressIdList: [],
  phoneNumber: "",
});

const allCities = [
  "Ho Chi Minh City",
  "Hanoi",
  "Da Nang",
  "Can Tho",
  "Hai Phong",
];

onBeforeMount(async () => {
  const tempUser = await usersService.getUserByEmail(userEmail.value);
  console.log(tempUser);
  Object.assign(userData, tempUser);

  profileImage.value = userData.avatarUrl;
});

const filterCities = (val, update) => {
  if (val === "") {
    update(() => {
      cities.value = allCities;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    cities.value = allCities.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const handleImageUpload = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveProfile = async () => {
  try {
    userData.avatarUrl = profileImage.value
    const res = await usersService.updateInfo(userData.id, userData);
    console.log(res);
    notify({
      title: "Success",
      text: "Cập nhật thành công!",
      type: "success",
      duration: 2000,
    });
  } catch (error) {
    console.log(error)
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
.profile-editor {
  max-width: 800px;
  margin: 0 auto;
  .field-container {
    margin-left: 50px;
    display: flex;
    align-items: center;
    max-width: 600px;
    .username-input {
      width: 350px;
    }
    .phonenumber-input {
      width: 200px;
    }
    .custom-text {
      width: 150px;
    }
  }
  .save-btn {
    margin-left: 50px;
  }
}

/* MY */
.profile-picture-container {
  .profile-picture-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;

    .upload-section {
      width: 100%;
      text-align: center;
    }
    .picture-title-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
  }
}
</style>
