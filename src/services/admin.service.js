import api from "./api.service";

class AdminService {
  constructor() {
    this.path = "/admin";
  }

  async getTotalRevenueOfPlatform(month, year) {
    const response = await api.get(`${this.path}/platform-revenue/${month}/${year}`);
    return response.data;
  }

  async getAllUsers() {
    return (await api.get(`${this.path}/users`)).data;
  }

  async deleteUser(id) {
    return (await api.delete(`${this.path}/users/${id}`)).data;
  }

  async openShop(id) {
    return (await api.put(`${this.path}/open-shops/${id}`)).data;
  }

  async closeShop(id) {
    return (await api.put(`${this.path}/close-shops/${id}`)).data;
  }

  async getShopById(id) {
    return (await api.get(`${this.path}/shops/${id}`)).data;
  }
}
export default new AdminService();
