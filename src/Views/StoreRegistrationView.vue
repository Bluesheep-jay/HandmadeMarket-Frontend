<template>
  <div class="registration-container q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      flat
    >
      <q-step :name="1" title="Basic Information" icon="store" :done="step > 1">
        <Step1Regis :formData="formData" @next="nextStep" />
      </q-step>

      <q-step
        :name="2"
        title="Location & Contact"
        icon="location_on"
        :done="step > 2"
      >
        <Step2Regis :formData="formData" @next="nextStep" @back="step--" />
      </q-step>

      <q-step :name="3" title="Store Settings" icon="settings">
        <Step3Regis :formData="formData" @back="step--" @submit="submitForm" />
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import Step1Regis from "../components/Step1Regis.vue";
import Step2Regis from "../components/Step2Regis.vue";
import Step3Regis from "../components/Step3Regis.vue";

const $q = useQuasar();
const step = ref(1);

const formData = ref({
  storeName: "",
  description: "",
  category: null,
  address: "",
  city: "",
  phone: "",
  email: "",
  logo: null,
  currency: null,
  shippingEnabled: false,
});

const nextStep = () => {
  step.value++;
};

const submitForm = async () => {
  try {
    // Here you would typically make an API call to submit the form data
    console.log("Form Data:", formData.value);

    $q.notify({
      type: "positive",
      message: "Store registration successful!",
    });

    // Reset form or redirect to dashboard
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Failed to register store. Please try again.",
    });
  }
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
