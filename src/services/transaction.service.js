import api from "./api.service";

class TransactionService {
  constructor() {
    this.path = "transactions";
  }

  async getAllByShopId(shopId) {
    return (await api.get(`${this.path}/shop/${shopId}`)).data;
  }

  async getAll() {
    return (await api.get(this.path)).data;
  }
}

export default new TransactionService();
