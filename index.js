import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect_db from "./config/db.js";
import verinarianRoutes from "./routes/veterinarianRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const server = express();

connect_db();

const whiteList = [
  "http://127.0.0.1:5173",
  "https://vpa-frontend-git-master-sojo506.vercel.app",
];

server.use(cors({ origin: whiteList }));

server.use(express.json());
server.use("/api/veterinarian", verinarianRoutes);
server.use("/api/patient", patientRoutes);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
