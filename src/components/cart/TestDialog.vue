<template>
  <q-dialog v-model="model">
    <q-card style="min-width: 350px">
      <q-card-section class="text-h6"> Đây là một Dialog test! </q-card-section>

      <q-card-section>
        Bạn có thể kiểm tra xem showAddressDialog hoạt động chưa.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Đóng" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

import { computed } from "vue";

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
