import api from "./api.service";

class EmailService {
  constructor() {
    this.api = "/email";
  }

  async sendEmail(email) {
    const res = await api.post(`${this.api}/send-otp?email=${email}`);
    return res;
  }

  async verifyEmail(email, otp) {
    const res = await api.post(`${this.api}/verify-otp?email=${email}&otp=${otp}`);
    return res
  }
}
export default new EmailService();
