import { defineStore } from "pinia"
import orderService from "../services/order.service"
import vnpayService from "../services/vnpay.service"

export const useOrderStore = defineStore("order", () => {
  async function createOrder(orders) {
    try {
      return await orderService.create(orders)
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  }

  async function prepareVnPayment(orders) {
    try {
      return await vnpayService.preparePayment(orders)
    } catch (error) {
      console.error("Error preparing VNPay payment:", error)
      throw error
    }
  }

  return {
    createOrder,
    prepareVnPayment,
  }
})

