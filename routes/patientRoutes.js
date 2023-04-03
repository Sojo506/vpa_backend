import { Router } from "express";
import {
  getPatients,
  addPatient,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientControllers.js";
import { checkAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-all", checkAuth, getPatients);
router.post("/register", checkAuth, addPatient);

router
  .route("/:id")
  .get(checkAuth, getPatient)
  .put(checkAuth, updatePatient)
  .delete(checkAuth, deletePatient);

export default router;
