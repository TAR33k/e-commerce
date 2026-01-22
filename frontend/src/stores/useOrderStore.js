import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,

  fetchMyOrders: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/orders/my");
      set({ orders: res.data?.orders || [], loading: false });
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch order history",
      );
      set({ loading: false });
      return false;
    }
  },
}));
