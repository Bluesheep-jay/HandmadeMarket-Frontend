<template>
  <div class="container">
    <q-card class="q-card-form">
      <q-card-section>
        <div class="text-h6">Đăng nhập</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            label="Email"
            type="email"
            :rules="[(val) => !!val || 'Email is required', isValidEmail]"
          />

          <q-input
            filled
            v-model="password"
            label="Mật khẩu"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) =>
                val.length >= 8 || 'Password must be at least 8 characters',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="register-btn-container">
            <q-btn
              class="register-btn"
              label="Đăng ký"
              type="submit"
              color="primary"
            />
            <div class="register-link-container">
              <router-link to="/register" class="register-link"
                >Đăng ký tài khoản</router-link
              >
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { useRouter } from "vue-router";

import registerService from "../services/authentication.service";
import { useAuthStore } from "../stores/auth";

const { notify } = useNotification();
const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const isPwd = ref(true);
const loginObj = ref(null);

const isValidEmail = (val) => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || "Invalid email";
};


const onSubmit = async () => {
  if (isValidEmail(email.value) === true && password.value.length >= 0) {
    loginObj.value = {
      email: email.value,
      password: password.value,
    };
    try {
      authStore.clearToken()
      const token = await registerService.login(loginObj.value);

      if (token) {
        authStore.setToken(token);
      }
      notify({
        title: "Success",
        text: "Đăng nhập thành công!",
        type: "success",
        duration: 2000,
      });
      router.push("/customer");
    } catch (error) {
      notify({
        title: "Error",
        text: "Lỗi đăng nhập",
        type: "error",
        duration: 2000,
      });
    }
  }
};
</script>


<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  background-image: url("https://i.pinimg.com/736x/ca/84/b3/ca84b3293ae40b2cf800c0dd85c879c8.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  .q-card-form {
    width: 500px;
    .text-h6 {
      text-align: center;
      font-size: 35px;
      padding: 10px 0;
    }
    .register-btn-container {
      text-align: center;
      .register-link-container{
        padding-top: 10px;

      }
      .register-link {
        top: 0;
        color: black;
      }
    }
  }
}
</style>
