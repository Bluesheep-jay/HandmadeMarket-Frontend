import api from "./api.service";

class CloudinaryService {
  constructor() {
    this.path = "upload/image";
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = (
      await api.post(`${this.path}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
    return res;
  }
}

export default new CloudinaryService();
