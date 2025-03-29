import api from "./api.service";

class CloudinaryService {
  constructor() {
    this.path = "upload";
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = (
      await api.post(`${this.path}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
    return res;
  }

  async uploadVideo(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = (
      await api.post(`${this.path}/video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
    return res;
  }
}

export default new CloudinaryService();
