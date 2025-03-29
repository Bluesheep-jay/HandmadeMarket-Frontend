import { defineStore } from "pinia"

export const useThemeStore = defineStore("theme", {
  state: () => ({
    currentTheme: "default",
  }),
  actions: {
    setTheme(theme) {
      this.currentTheme = theme
    },
  },
})

