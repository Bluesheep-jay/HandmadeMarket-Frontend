import { createWebHistory, createRouter } from "vue-router";

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
          path: "profile",
          component: () => import("../Views/customer/WishListView.vue"),
        },
        {
          path: "profile-editing",
          component: () => import("../Views/customer/ProfileEditingView.vue"),
        },
        {
          path: "store-registration",
          component: () => import("../Views/customer/StoreRegistrationView.vue"),
        },
      ],
    },
    {
      path: "/shop",
      component: () => import("../Views/shop/ShopMainLayout.vue"),
      children: [
        {
          path: "",
          component: () => import("../Views/shop/ShopInfoView.vue"),
        },
        {
          path: "identify",
          component: () => import("../Views/shop/ShopIdentifyView.vue"),
        },
        {
          path: "products",
          component: () => import("../Views/shop/ProductView.vue"),
        },
        {
          path: "add-products",
          component: () => import("../Views/shop/AddProductMainLayout.vue"),
          children:[
            {
              path: "",
              name:"about",
              component: () => import("../components/AboutSection.vue")
            },
            {
              path: "photo",
              name:"photo",
              component: () => import("../components/PhotoSection.vue")
            },
            {
              path: "price-invention",
              name:"price",
              component: () => import("../components/PriceInvention.vue")
            },
            {
              path: "shipping-secion",
              name:"shipping",
              component: () => import("../components/ShippingSection.vue")
            }
          ]
        },
      ],
    },
  ],
});

export default router;
