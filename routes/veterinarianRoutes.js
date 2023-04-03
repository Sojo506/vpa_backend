import { Router } from "express";
import {
  profile,
  register,
  confirm,
  login,
  forgotPassword,
  newPassword,
  forgotPasswordToken,
  updateProfile,
  updatePassword,
} from "../controllers/veterinarianControllers.js";
import { checkAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", checkAuth, profile);
router.get("/confirm/:token", confirm);

router.post("/forgot-password", forgotPassword);

router.put("/profile/:id", checkAuth, updateProfile);
router.put("/change-password", checkAuth, updatePassword);

router
  .route("/forgot-password/:token")
  .get(forgotPasswordToken)
  .post(newPassword);

export default router;
