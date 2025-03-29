import api from "./api.service";

class ReviewService {
  constructor() {
    this.path = "reviews";
  }

  async getReviewByUserId(userId) {
    return (await api.get(`${this.path}/by-user/${userId}`)).data;
  }

  async getReviewByProductId(productId) {
    return (await api.get(`${this.path}/by-product/${productId}`)).data;
  }

  async getAll() {
    return (await api.get(`${this.path}`)).data;
  }

  async addReview(review) {
    return (await api.post(`${this.path}`, review)).data;
  }
}

export default new ReviewService();
