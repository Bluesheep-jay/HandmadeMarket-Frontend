import { defineStore } from "pinia"
import paymentMethodService from "../services/paymentMethod.service"

export const usePaymentStore = defineStore("payment", () => {
  async function fetchPaymentMethods() {
    try {
      return await paymentMethodService.getAll()
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      throw error
    }
  }

  return {
    fetchPaymentMethods,
  }
})

