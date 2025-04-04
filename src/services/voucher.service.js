import api from "./api.service";

class VoucherService {
  constructor() {
    this.path = "/vouchers";
  }

  async getAllVouchers() {
    return (await api.get(this.path)).data;
  }

  async getVouchersByPlatform() {
    return (await api.get(`${this.path}/by-platform`)).data;
  }

  async getVouchersByShopId(shopId) {
    return (await api.get(`${this.path}/by-shop/${shopId}`)).data;
  }

  async addVoucher(voucher) {
    return (await api.post(this.path, voucher)).data
  }

  async deleteVoucher(id) {
    return (await api.delete(`${this.path}/${id}`)).data
  }
}
export default new VoucherService();
