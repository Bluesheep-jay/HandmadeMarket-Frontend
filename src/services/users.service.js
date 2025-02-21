import api from "./api.service";

class UserService {
  constructor() {
    this.path = "users";
  }
  async getUserByEmail(email) {
    const res = (await api.get(`${this.path}/email/${email}`)).data;
    return res;
  }

  async updateInfo(id, userData){
    const res = (await api.put(`${this.path}/update-info/${id}`, userData)).data;
    return res;
  }
}

export default new UserService();
