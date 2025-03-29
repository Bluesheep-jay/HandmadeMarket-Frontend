import api from "./api.service";

class OrderService {
  constructor() {
    this.path = "orders";
  }

  async getAll() {
    const res = await api.get(`${this.path}`);
    return res.data;
  }

  async getAllOrderWithProductByUserId(userId) {
    const res = await api.get(`${this.path}/with-products/customer/${userId}`);
    return res.data;
  }

  async getAllOrderWithProductByShopId(shopId) {
    const res = await api.get(`${this.path}/with-products/shop/${shopId}`);
    return res.data;
  }

  async getMonthlyRevenueForYear(shopId, year) {
    return (
      await api.get(`${this.path}/monthly-revenue-for-year/${shopId}/${year}`)
    ).data;
  }
  async getDailyRevenueForMonth(shopId, year, month) {
    return (await api.get(`${this.path}/daily-revenue-for-month/${shopId}/${year}/${month}`))
      .data;
  }

  async create(orders) {
    const res = await api.post(`${this.path}`, orders);
    return res.data;
  }

  async updateStatus(orderId, statusId) {
    return (await api.put(`${this.path}/${orderId}/status/${statusId}`)).data;
  }
}

export default new OrderService();
