import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
  verifyEmail,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
  resendEmailVerification,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password/:resetToken", resetForgotPassword);
router.post("/resend-email-verification", resendEmailVerification);

router.get("/profile", protectRoute, getProfile);
router.post("/change-password", protectRoute, changeCurrentPassword);

export default router;
