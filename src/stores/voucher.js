import { defineStore } from "pinia"
import voucherService from "../services/voucher.service"
import voucherUsageService from "../services/voucherUsage.service"

export const useVoucherStore = defineStore("voucher", () => {
  async function fetchPlatformVouchers() {
    try {
      return await voucherService.getVouchersByPlatform()
    } catch (error) {
      console.error("Error fetching platform vouchers:", error)
      throw error
    }
  }

  async function fetchShopVouchers(shopId) {
    try {
      return await voucherService.getVouchersByShopId(shopId)
    } catch (error) {
      console.error("Error fetching shop vouchers:", error)
      throw error
    }
  }

  async function createVoucherUsage(voucherUsage) {
    try {
      return await voucherUsageService.createVoucherUsage(voucherUsage)
    } catch (error) {
      console.error("Error creating voucher usage:", error)
      throw error
    }
  }

  return {
    fetchPlatformVouchers,
    fetchShopVouchers,
    createVoucherUsage,
  }
})

