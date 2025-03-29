<template>
  <q-card class="theme-manager">
    <q-card-section>
      <div class="text-h6">Theme Manager</div>
    </q-card-section>
    <q-card-section>
      <q-select
        v-model="selectedTheme"
        :options="themeOptions"
        label="Select Theme"
        outlined
        emit-value
        map-options
        @update:model-value="updateTheme"
      />
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div
          class="col-12 col-sm-6"
          v-for="option in themeOptions"
          :key="option.value"
        >
          <q-card
            :class="{ 'bg-primary text-white': selectedTheme === option.value }"
          >
            <q-card-section>
              <div class="text-h6">{{ option.label }}</div>
              <q-img :src="option.preview" :ratio="16 / 9" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useThemeStore } from "./theme";

const themeStore = useThemeStore();

const themeOptions = [
  { label: "Default", value: "default", preview: "/images/theme-default.jpg" },
  {
    label: "Christmas",
    value: "christmas",
    preview: "/images/theme-christmas.jpg",
  },
  {
    label: "Lunar New Year",
    value: "lunar-new-year",
    preview: "/images/theme-lunar-new-year.jpg",
  },
];

const selectedTheme = ref(themeStore.currentTheme);

const updateTheme = (newTheme) => {
  themeStore.setTheme(newTheme);
};
</script>
