import { defineStore } from "pinia"
import { ref } from "vue"
import usersService from "../services/users.service"

export const useUserStore = defineStore("user", () => {
  const userData = ref(null)
  const userEmail = localStorage.getItem("userEmail")

  async function fetchCurrentUser() {
    try {
      userData.value = await usersService.getUserByEmail(userEmail)
      return userData.value
    } catch (error) {
      console.error("Error fetching user data:", error)
      throw error
    }
  }

  return {
    userData,
    fetchCurrentUser,
  }
})

