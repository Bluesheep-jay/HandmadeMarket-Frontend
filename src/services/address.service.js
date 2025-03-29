import api from "./api.service";

class AddressService {
  constructor() {
    this.path = "addresses";
  }

  async getAll() {
    const res = await api.get(`${this.path}`);
    return res.data;
  }

  async getAddressListByUserId(userId) {
    const res = await api.get(`${this.path}/user/${userId}`);
    return res.data;
  }

  async create(address) {
    const res = (await api.post(`${this.path}`, address)).data;
    return res;
  }
  async delete(id) {
    await api.delete(`${this.path}/${id}`);
  }
}

export default new AddressService();
