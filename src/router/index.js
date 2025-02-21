import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/register", component: () => import("../Views/RegisterView.vue") },
    { path: "/login", component: () => import("../Views/LoginView.vue") },
    
    {
      path: "/",
      component: () => import("../Views/MainLayoutView.vue"),
      children: [
        {
          path: "",
          component: () => import("../Views/HomePageView.vue"),
        },
        { path: "profile", component: () => import("../Views/WishListView.vue") },
        { path: "profile-editing", component: () => import("../Views/ProfileEditingView.vue") },
        { path: "store-registration", component: () => import("../Views/StoreRegistrationView.vue") },

      ],
    },
  ],
});


export default router;