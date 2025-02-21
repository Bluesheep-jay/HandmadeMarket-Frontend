import api from "./api.service";

class CategoryService {
  constructor() {
    this.path = "categories";
  }

  async getAll() {
    const res = await api.get(`${this.path}`);
    return res.data;
  }

  async create() {
    const res = (await api.get(`${this.path}`)).data;
    return data;
  }
}

export default new CategoryService();
