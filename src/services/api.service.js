import axios from "axios";
import { useAuthStore } from "../stores/auth";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
};

const api = axios.create({
  baseURL: "http://localhost:8081/",
  ...commonConfig,
});

// api.interceptors.request.use(
//   (config) => {
//     const authStore = useAuthStore();
//     if (authStore.token) {
//       config.headers.Authorization = `Bearer ${authStore.token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       const authStore = useAuthStore();
//       authStore.clearToken(); 
//       window.location.href = "/login"; 
//     }
//     return Promise.reject(error);
//   }
// );
export default api;
