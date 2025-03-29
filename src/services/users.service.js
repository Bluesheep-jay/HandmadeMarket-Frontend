import api from "./api.service";

class UserService {
  constructor() {
    this.path = "users";
  }
  async getUserByEmail(email) {
    const res = (await api.get(`${this.path}/email/${email}`)).data;
    return res;
  }

  async getUserById(id) {
    const res = (await api.get(`${this.path}/${id}`)).data;
    return res;
  }

  async getWishList(id) {
    const res = (await api.get(`${this.path}/wishlist/${id}`)).data;
    return res;
  }

  async updateInfo(id, userData) {
    const res = (await api.put(`${this.path}/update-info/${id}`, userData))
      .data;
    return res;
  }

  async addToWishList(userId, productId) {
    try {
      const res = (
        await api.put(`${this.path}/update-wishlist/${userId}/${productId}`)
      ).data;
      return res;
    } catch (err) {
      console.log(err);
    }
  }
  
  async removeFromWishList(userId, productId) {
    const res = (
      await api.delete(
        `${this.path}/remove-from-wishlist/${userId}/${productId}`
      )
    ).data;
    return res;
  }
}

export default new UserService();
