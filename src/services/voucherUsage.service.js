import api from "./api.service";

class VoucherUsageService {
  constructor() {
    this.path = "/voucher-usages";
  }

  async getAllVoucherUsage() {
    return (await api.get(this.path)).data;
  }

  async createVoucherUsage(voucherUsage) {
    return (await api.post(this.path, voucherUsage)).data;
  }
}

export default new VoucherUsageService();
