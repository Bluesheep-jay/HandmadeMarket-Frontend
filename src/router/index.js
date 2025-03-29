import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomePageView from "../Views/customer/HomePageView.vue";
import NotFoundView from "../Views/customer/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/register", component: () => import("../Views/RegisterView.vue") },
    { path: "/login", component: () => import("../Views/LoginView.vue") },

    {
      path: "/customer",
      component: () => import("../Views/customer/CustomerMainLayout.vue"),
      children: [
        {
          path: "",
          component: () => import("../Views/customer/HomePageView.vue"),
        },

        {
          path: "product-list/:id?",
          component: () => import("../Views/customer/ProductList.vue"),
        },
        {
          path: "product-detail/:id",
          component: () => import("../Views/customer/ProductDetail.vue"),
        },
        {
          path: "cart",
          component: () => import("../Views/customer/CartView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "vnpay-payment-return",
          component: () => import("../Views/customer/SuccessTransaction.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "profile",
          component: () => import("../Views/customer/WishListView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "profile-editing",
          component: () => import("../Views/customer/ProfileEditingView.vue"),
          meta: { requiresAuth: true },
        },

        {
          path: "order-and-review",
          component: () => import("../Views/customer/OrderHistory.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "store-registration",
          component: () =>
            import("../Views/customer/StoreRegistrationView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "shop-detail/:id",
          component: () =>
            import("../Views/customer/ShopDetail.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/:pathMatch(.*)*",
          component: NotFoundView,
        },
      ],
    },
    {
      path: "/shop",
      component: () => import("../Views/shop/ShopMainLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          component: () => import("../Views/shop/ShopInfoView.vue"),
        },
        {
          path: "address",
          component: () => import("../Views/shop/ShopAddresss.vue"),
        },
        {
          path: "identify",
          component: () => import("../Views/shop/ShopIdentifyView.vue"),
        },
        {
          path: "order-management",
          component: () => import("../Views/shop/OrderManagement.vue"),
        },
        {
          path: "canceled-order-management",
          component: () => import("../Views/shop/CanceledOrderManagement.vue"),
        },
        {
          path: "transaction-management",
          component: () => import("../Views/shop/TransactionManagement.vue"),
        },
        {
          path: "revenue-management",
          component: () => import("../Views/shop/RevenueManagement.vue"),
        },
        {
          path: "products",
          component: () => import("../Views/shop/ProductView.vue"),
        },
        {
          path: "add-products",
          component: () => import("../Views/shop/AddProductMainLayout.vue"),
          children: [
            {
              path: "",
              name: "about",
              component: () => import("../components/AboutSection.vue"),
            },
            {
              path: "photo",
              name: "photo",
              component: () => import("../components/PhotoSection.vue"),
            },
            {
              path: "price-invention",
              name: "price",
              component: () => import("../components/PriceInvention.vue"),
            },
            {
              path: "shipping-secion",
              name: "shipping",
              component: () => import("../components/ShippingSection.vue"),
            },
          ],
        },
      ],
    },

    {
      path: "/admin",
      component: () => import("../Views/Admin/AdminDashBoard.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});
export default router;
