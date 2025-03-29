import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

class productRecommendationService {
  async getRecommendations(productId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/recommendations?product_id=${productId}`
      );
      return response.data
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      throw error;
    }
  }

  async getByCollaborativeFilter(userId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/recommendations/by-cf?user_id=${userId}`
      );
      return response.data
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      throw error;
    }
  }

  
}

export default new productRecommendationService();
