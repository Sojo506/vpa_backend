import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateId } from "../utils/generateId.js";

const veterinarianSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  lastName: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    default: "",
    trim: true,
  },
  web: {
    type: String,
    default: "",
  },
  token: {
    type: String,
    default: generateId(),
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

/* BEFORE SAVE USER, HASH PASSWORD */
veterinarianSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

veterinarianSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Veterinarian = mongoose.model("Verinarian", veterinarianSchema);

export default Veterinarian;
