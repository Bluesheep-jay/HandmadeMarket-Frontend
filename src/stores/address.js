import { defineStore } from "pinia"
import addressService from "../services/address.service"

export const useAddressStore = defineStore("address", () => {
  async function fetchUserAddresses(userId) {
    try {
      return await addressService.getAddressListByUserId(userId)
    } catch (error) {
      console.error("Error fetching user addresses:", error)
      throw error
    }
  }

  async function createAddress(addressData) {
    try {
      return await addressService.create(addressData)
    } catch (error) {
      console.error("Error creating address:", error)
      throw error
    }
  }

  async function deleteAddress(addressId) {
    try {
      return await addressService.delete(addressId)
    } catch (error) {
      console.error("Error deleting address:", error)
      throw error
    }
  }

  return {
    fetchUserAddresses,
    createAddress,
    deleteAddress,
  }
})

