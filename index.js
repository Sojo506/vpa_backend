import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect_db from "./config/db.js";
import verinarianRoutes from "./routes/veterinarianRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const server = express();

connect_db();

server.use(
  cors({
    origin: "https://vpa-frontend-kqtpmz7z9-sojo506.vercel.app",
  })
);

server.use(express.json());
server.use("/api/veterinarian", verinarianRoutes);
server.use("/api/patient", patientRoutes);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
