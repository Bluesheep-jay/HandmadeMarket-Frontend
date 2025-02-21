import api from "./api.service";

class RegisterService {
  constructor() {
    this.path = "register";
  }
  async register(userInfo) {
    const res = (await api.post(`${this.path}`, userInfo)).data;
    return res;
  }

  async login(credentials){
    const res = (await api.post(`login`, credentials)).data;
    return res;
  }

  
}

export default new RegisterService()