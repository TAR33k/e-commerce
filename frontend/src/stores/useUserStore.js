import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  needsEmailVerification: false,
  pendingEmail: "",

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Passwords do not match");
      return false;
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({
        user: null,
        loading: false,
        needsEmailVerification: true,
        pendingEmail: res.data.email,
      });
      toast.success(
        "Account created. Please verify your email address before logging in",
        { duration: 5000 },
      );
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });

      set({
        user: res.data,
        loading: false,
        needsEmailVerification: false,
        pendingEmail: "",
      });
      return true;
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || "An error occurred";
      if (error.response?.status === 403) {
        set({ needsEmailVerification: true, pendingEmail: email });
      }
      toast.error(message);
      return false;
    }
  },

  consumeEmailVerificationRedirect: () => {
    set({ needsEmailVerification: false });
  },

  clearEmailVerificationState: () => {
    set({ needsEmailVerification: false, pendingEmail: "" });
  },

  verifyEmail: async (token) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/auth/verify-email/${token}`);
      toast.success(res.data?.message || "Email verified");
      set({ loading: false, needsEmailVerification: false });
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Email verification failed",
        { duration: 5000 },
      );
      set({ loading: false });
      return false;
    }
  },

  resendEmailVerification: async (email) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/resend-email-verification", {
        email,
      });
      toast.success(res.data?.message || "Verification email sent");
      set({
        loading: false,
        needsEmailVerification: true,
        pendingEmail: email,
      });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email", {
        duration: 5000,
      });
      set({ loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequest);
      } catch (error) {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
