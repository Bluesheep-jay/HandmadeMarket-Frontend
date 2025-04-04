import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    enumRole: null,
    userId: null,
  }),

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    clearToken() {
      this.token = null;
      this.user = null;
      this.enumRole = null;
      this.userId = null;
      localStorage.removeItem("token");
    },

    setUser(user) {
      this.user = user;
    },
    setUserId(id) {
      this.userId = id;
    },
    setRole(role) {
      this.enumRole = role;
      localStorage.setItem("userRole", role); 
    },
    
    initializeToken() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.enumRole === "ADMIN",
  },
});
