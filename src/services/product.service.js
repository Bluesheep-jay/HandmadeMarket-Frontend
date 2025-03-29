import api from "./api.service";

class ProductService {
  constructor() {
    this.path = "products";
  }

  async getAll() {
    const res = (await api.get(`${this.path}`)).data;
    return res;
  }

  async getProductById(id) {
    const res = (await api.get(`${this.path}/${id}`)).data;
    return res;
  }

  async getProductByIdList(idList) {
    const res = (await api.post(`${this.path}/by-id-list`, idList)).data;
    return res;
  }

  async getProductBySearchText(q) {
    const res = (await api.get(`${this.path}/searchText?q=${q}`)).data;
    return res;
  }

  async getAllByCategoryRootId(rootCategoryId) {
    const res = (await api.get(`${this.path}/by-root-category/${rootCategoryId}`)).data;
    return res;
  }

  async updateProduct(productId, product) {
    const res = (await api.put(`${this.path}/update-product/${productId}`, product)).data;
    return res;
  }

}

export default new ProductService();
