import api from "../services/api.service";

class ShopService {
  constructor() {
    this.path = "shops";
  }

  async getAll() {
    const res = (await api.get(`${this.path}`)).data;
    return res;
  }

  async getById(id) {
    const res = (await api.get(`${this.path}/${id}`)).data;
    return res;
  }
  async createShop(shop) {
    const res = (await api.post(`${this.path}`, shop)).data;
    return res;
  }

  async updateInfo(id, shopData) {
    const res = (await api.put(`${this.path}/info/${id}`, shopData)).data;
    return res;
  }

  async addProduct(product) {
    const res = (await api.post(`${this.path}/add-product`, product)).data;
    return res;
  }

  async getProductsByShopId(shopId) {
    const res = (await api.get(`${this.path}/product-list/by-shop-id/${shopId}`)).data;
    return res;
  }
}

export default new ShopService();
