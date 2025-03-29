import api from "./api.service";

class VNPayService {
  constructor() {
    this.path = "vnpay";
  }

  async create(orderTotal) {
    return (await api.post(`${this.path}/submitOrder?amount=${orderTotal}`)).data;
  }

  async preparePayment(orderList) {
    return (await api.post(`${this.path}/preparePayment`, orderList)).data;
  }
}

export default new VNPayService();
