import api from "./api.service";

class TransactionService {
  constructor() {
    this.path = "transactions";
  }

  async getAllByShopId(shopId) {
    return (await api.get(`${this.path}/shop/${shopId}`)).data;
  }
}

export default new TransactionService();
