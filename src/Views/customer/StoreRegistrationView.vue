<template>
  <div class="registration-container q-pa-md">
    <q-stepper v-model="step" ref="stepper" color="primary" animated flat>
      <q-step :name="1" title="Thông tin shop" icon="info" :done="step > 1">
        <Step1Regis :formData="formData" @next="nextStep" />
      </q-step>

      <q-step
        :name="2"
        title="Thông tin thuế và định danh"
        icon="remember_me"
        :done="step > 2"
      >
        <Step2Regis :formData="formData" @next="nextStep" @back="step--" />
      </q-step>

      <q-step :name="3" title="Hoàn tất" icon="verified_user">
        <Step3Regis :formData="formData" @back="step--" @submit="submitForm" />
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import Step1Regis from "../../components/Step1Regis.vue";
import Step2Regis from "../../components/Step2Regis.vue";
import Step3Regis from "../../components/Step3Regis.vue";
import usersService from "../../services/users.service";

const $q = useQuasar();
const step = ref(1);
const router = useRouter();

const userEmail = ref(localStorage.getItem("userEmail"));
const userInfo = ref(null);
const formData = ref({
  shopName: "",
  fullName: "",
  provinceId: "",
  districtId: "",
  wardId: "",
  provinceName: "",
  districtName: "",
  wardName: "",
  specificAddress: "",
  phoneNumber: "",
});

onBeforeMount(async () => {
  try {
    userInfo.value = await usersService.getUserByEmail(userEmail.value);
    if (userInfo.value.shopId) {
      localStorage.setItem("shopId", userInfo.value.shopId);
      router.push("/shop");
    }
    formData.value.userId = userInfo.value.id;
  } catch (error) {
    console.log(error);
  }
});
const nextStep = () => {
  step.value++;
};

</script>

<style scoped>
.registration-container {
  max-width: 1000px;
  margin: 0 auto;
}

.registration-card {
  min-height: 500px;
}

:deep(.q-stepper__header) {
  margin-bottom: 2rem;
}

:deep(.q-stepper__tab) {
  padding: 1rem;
}
</style>
