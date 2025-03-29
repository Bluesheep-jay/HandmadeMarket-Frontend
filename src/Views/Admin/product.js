import { defineStore } from "pinia"

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [
      {
        id: 1,
        name: "Christmas Tree",
        price: "$50",
        image: "/images/christmas-tree.jpg",
        season: "christmas",
        active: true,
      },
      {
        id: 2,
        name: "Red Envelope",
        price: "$5",
        image: "/images/red-envelope.jpg",
        season: "lunar-new-year",
        active: true,
      },
      {
        id: 3,
        name: "New Year Cake",
        price: "$20",
        image: "/images/new-year-cake.jpg",
        season: "lunar-new-year",
        active: true,
      },
      {
        id: 4,
        name: "Regular Product",
        price: "$10",
        image: "/images/regular-product.jpg",
        season: "all",
        active: true,
      },
    ],
  }),
  actions: {
    updateProductStatus(productId, status) {
      const product = this.products.find((p) => p.id === productId)
      if (product) {
        product.active = status
      }
    },
  },
  getters: {
    getProductsBySeason: (state) => (season) => {
      if (season === "all") {
        return state.products
      }
      return state.products.filter((product) => product.season === season || product.season === "all")
    },
  },
})

