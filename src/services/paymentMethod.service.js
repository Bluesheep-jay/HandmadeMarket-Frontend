import api from "./api.service";

class PaymentMethodService {
  constructor() {
    this.path = "payment-methods";
  }

  async getAll() {
    const res = await api.get(`${this.path}`);
    return res.data;
  }
}

export default new PaymentMethodService()
