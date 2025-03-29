import api from "./api.service";

class CategoryService {
  constructor() {
    this.path = "categories";
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

  async create() {
    const res = (await api.get(`${this.path}`)).data;
    return data;
  }
}

export default new CategoryService();
