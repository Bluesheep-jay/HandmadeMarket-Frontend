// const { data } = await axios.post(
//   "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",

import axios from "axios";
class GiaoHangNhanhService {
  constructor() {
    this.path = "https://online-gateway.ghn.vn/shiip/public-api/master-data";
    this.GHN_TOKEN = "818b4dd4-f033-11ef-8d27-522b302a1469";
  }

  async getProvince() {
    const res = (
      await axios.get(`${this.path}/province`, {
        headers: { Token: this.GHN_TOKEN },
      })
    ).data;
    return res;
  }

  async getDistrict(province) {
    const res = (
      await axios.post(
        `${this.path}/district`,
        { province_id: province },
        { headers: { Token: this.GHN_TOKEN } }
      )
    ).data;
    return res;
  }

  async getWard(district) {
    const res = (
      await axios.post(
        `${this.path}/ward`,
        { district_id: district },
        { headers: { Token: this.GHN_TOKEN } }
      )
    ).data;
    return res;
  }

  async getService(data) {
    const res = (
      await axios.post(
        `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Token: this.GHN_TOKEN,
          },
        }
      )
    ).data;
    return res;
  }

  async calculateFee(requestData) {
    const res = (
      await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Token: this.GHN_TOKEN,
            ShopId: 5648020,
          },
        }
      )
    ).data;

    return res;
  }
}
export default new GiaoHangNhanhService();
