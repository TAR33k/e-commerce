import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "Failed to fetch cart items");
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const updatedCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: updatedCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Failed to add to cart");
    }
  },

  calculateTotals: () => {
    const { cart, coupon, isCouponApplied } = get();
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const total =
      coupon && isCouponApplied
        ? subtotal * (1 - coupon.discountPercentage / 100)
        : subtotal;
    set({ subtotal, total });
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Failed to remove from cart");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    try {
      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => {
        const updatedCart = prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        );
        return { cart: updatedCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Failed to update quantity");
    }
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    try {
      await axios.delete("/cart");
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Failed to clear cart");
    }
  },

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.log("Error fetching coupon", error.message);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
  },
}));
