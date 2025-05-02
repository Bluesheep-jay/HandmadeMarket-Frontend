import api from "./api.service";

class AdminService {
  constructor() {
    this.path = "/admin";
  }

  async getMonthlyRevenueForYear(year) {
    const response = await api.get(
      `${this.path}/platform-revenue/monthly-for-year/${year}`
    );
    return response.data;
  }

  async getTotalRevenueOfPlatform(month, year) {
    const response = await api.get(
      `${this.path}/platform-revenue/${month}/${year}`
    );
    return response.data;
  }

  // SHOPS -------------------
  async openShop(id) {
    return (await api.put(`${this.path}/open-shops/${id}`)).data;
  }

  async closeShop(id) {
    return (await api.put(`${this.path}/close-shops/${id}`)).data;
  }
}
export default new AdminService();
