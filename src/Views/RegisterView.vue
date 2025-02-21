<template>
  <div class="container">
    <q-card class="q-card-form">
      <q-card-section>
        <div class="text-h6">Đăng ký</div>
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
            <q-btn class="register-btn" label="Đăng ký" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { useRouter } from "vue-router";
import registerService from "../services/authentication.service";

export default {
  name: "UserRegistration",
  setup() {
    const { notify } = useNotification();
    const router = useRouter()
    const email = ref("");
    const password = ref("");
    const isPwd = ref(true);
    const registerObj = ref(null);

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    };

    const onSubmit = async () => {
      if (isValidEmail(email.value) === true && password.value.length >= 0) {
        registerObj.value = {
          email: email.value,
          password: password.value,
        };
        var res;
        try {
          res = await registerService.register(registerObj.value);
          notify({
            title: "Success",
            text: "Đăng ký thành công!",
            type: "success",
            duration: 3000,
          });
          router.push("/login")
        } catch (error) {
        
          notify({
            title: "Error",
            text: "Email đã được sử dụng",
            type: "error",
            duration: 3000,
          });
        }
      }
    };

    return {
      email,
      password,
      isPwd,
      isValidEmail,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  background-image: url("https://i.pinimg.com/736x/b1/21/43/b12143bf1ecd6316be5e737cdfbe8268.jpg"); 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  .q-card-form {
    width: 500px;
    .text-h6{
      text-align: center;
      font-size: 35px;
      padding: 10px 0;
    }
    .register-btn-container{
      text-align: center;
    }
  
  }
}
</style>
