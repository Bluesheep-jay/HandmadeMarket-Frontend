import api from "./api.service";

class CategoryService {
  constructor() {
    this.path = "categories";
  }

  async getTop5(month, year){
    const res = (await api.get(`${this.path}/top5/${month}/${year}`)).data
    return res
  }
  async getAll() {
    const res = (await api.get(`${this.path}`)).data;
    return res;
  }
  async getRootCategory(){
    const res = (await api.get(`${this.path}/roots`)).data
    return res
  }

  async getSubCategories(parentId){
    const res = (await api.get(`${this.path}/subcategories/${parentId}`)).data
    return res
  }


  async getAllParentCategories(categoryId){
    const res = (await api.get(`${this.path}/all-parents/${categoryId}`)).data
    return res
  }

  async create(categoryForm) {
    const res = (await api.post(`${this.path}`, categoryForm)).data;
    return res;
  }
}

export default new CategoryService();
