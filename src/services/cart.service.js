import api from "./api.service";

class CartService {
  constructor() {
    this.path = "carts";
  }

  async getById(id) {
    const res = (await api.get(`${this.path}/${id}`)).data;
    return res;
  }

  async addToCart(cartId, cartItem) {
    const res = (await api.put(`${this.path}/${cartId}`, cartItem)).data;
    return res;
  }

  async removeItem(cartId, productId) {
    const res = (
      await api.put(`${this.path}/removeItem/${cartId}/${productId}`)
    ).data;
    return res;
  }

  async clearCart(cartId) {
    const res = (
      await api.put(`${this.path}/clearCart/${cartId}`)
    ).data;
    return res;
  }
}

export default new CartService();
