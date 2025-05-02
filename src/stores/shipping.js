import { defineStore } from "pinia"
import { ref } from "vue"
import ghnService from "../services/ghn.service"

export const useShippingStore = defineStore("shipping", () => {
  const provinces = ref([])

  async function fetchProvinces() {
    try {
      const data = await ghnService.getProvince()
      provinces.value = data.data.map((province) => ({
        label: province.ProvinceName,
        value: province.ProvinceID,
      }))
      return provinces.value
    } catch (error) {
      console.error("Error fetching provinces:", error)
      throw error
    }
  }

  async function fetchDistricts(provinceId) {
    try {
      const data = await ghnService.getDistrict(provinceId)
      return data.data.map((district) => ({
        label: district.DistrictName,
        value: district.DistrictID,
      }))
    } catch (error) {
      console.error("Error fetching districts:", error)
      throw error
    }
  }

  async function fetchWards(districtId) {
    try {
      const data = await ghnService.getWard(districtId)
      return data.data.map((ward) => ({
        label: ward.WardName,
        value: ward.WardCode,
      }))
    } catch (error) {
      console.error("Error fetching wards:", error)
      throw error
    }
  }

  async function calculateFee(shippingData) {
    try {
      const reqData = {
        from_district_id: shippingData.fromDistrictId,
        from_ward_code: shippingData.fromWardCode,
        service_id: 53320,
        to_district_id: shippingData.toDistrictId,
        to_ward_code: shippingData.toWardCode,
        height: 10,
        length: 10,
        weight: shippingData.weight || 300,
        width: 10,
        insurance_value: 10000,
        cod_failed_amount: 2000,
        coupon: null,
      }

      // Get available services
      const reqServiceData = {
        shop_id: 5648020,
        from_district: reqData.from_district_id,
        to_district: reqData.to_district_id,
      }

      const serviceList = await ghnService.getService(reqServiceData)
      reqData.service_id = serviceList.data[0].service_id

      // Calculate fee
      const res = await ghnService.calculateFee(reqData)
      return Math.ceil(res.data.total / 1000) * 1000
    } catch (error) {
      console.error("Error calculating shipping fee:", error)
      throw error
    }
  }

  return {
    provinces,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
    calculateFee,
  }
})

