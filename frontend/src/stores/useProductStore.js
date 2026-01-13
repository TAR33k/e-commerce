import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  searchMeta: { total: 0, page: 1, numPages: 1 },

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },

  searchProducts: async ({
    name,
    category,
    sort,
    priceOperator,
    priceValue,
    page = 1,
    limit = 20,
  }) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);

      if (priceOperator && priceValue !== "" && priceValue !== null) {
        params.set("numericFilters", `price${priceOperator}${priceValue}`);
      }

      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await axios.get(`/products/search?${params.toString()}`);

      set({
        products: res.data.products,
        searchMeta: {
          total: res.data.total,
          page: res.data.page,
          numPages: res.data.numPages,
        },
        loading: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
      set({ loading: false });
    }
  },
}));
