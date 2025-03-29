import api from "./api.service";

class OrderStatusService {
  constructor() {
    this.path = "order-statuses";
  }

  async getAll() {
    return (await api.get(`${this.path}`)).data;
  }
}

export default new OrderStatusService();
