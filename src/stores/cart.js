import { defineStore } from "pinia"
import { ref } from "vue"
import cartService from "../services/cart.service"

export const useCartStore = defineStore("cart", () => {
  const cartData = ref({
    id: "",
    cartItems: [],
    cartTotalAmount: 0,
  })

  async function fetchCart(cartId) {
    try {
      cartData.value = await cartService.getById(cartId)
      return cartData.value
    } catch (error) {
      console.error("Error fetching cart:", error)
      throw error
    }
  }

  async function removeItem(productId) {
    try {
      await cartService.removeItem(cartData.value.id, productId)
      cartData.value.cartItems = cartData.value.cartItems.filter((item) => item.productId !== productId)
      return true
    } catch (error) {
      console.error("Error removing item from cart:", error)
      throw error
    }
  }

  async function clearCart() {
    try {
      await cartService.clearCart(cartData.value.id)
      cartData.value.cartItems = []
      cartData.value.cartTotalAmount = 0
      return true
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  function getTotalAmount() {
    return cartData.value.cartItems.reduce((sum, item) => sum + (item.subPrice * item.quantity || 0), 0)
  }

  return {
    cartData,
    fetchCart,
    removeItem,
    clearCart,
    getTotalAmount,
  }
})

