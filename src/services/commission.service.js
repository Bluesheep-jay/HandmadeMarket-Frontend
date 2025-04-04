import api from "./api.service";

class CommissionService {
  constructor() {
    this.path = "/commission-rates";
  }

  async getCommissions() {
    const response = await api.get(`${this.path}`);
    return response.data;
  }

  async getCommissionById(id) {
    const response = await api.get(`/commissions/${id}`);
    return response.data;
  }

  async createCommission(commission) {
    const response = await api.post("/commissions", commission);
    return response.data;
  }

  async updateCommission(id, commission) {
    const response = await api.put(`/commissions/${id}`, commission);
    return response.data;
  }

  async deleteCommission(id) {
    const response = await api.delete(`/commissions/${id}`);
    return response.data;
  }
}

export default new CommissionService();
