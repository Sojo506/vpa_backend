import mongoose from "mongoose";

const patientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dischargeDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  symptoms: {
    type: String,
    required: true,
  },
  veterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Veterinarian",
  },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
