import Patient from "../models/Patient.js";

/* ==========GET========== */
const getPatient = async (req, res) => {
  const { id } = req.params;
  const veterinarian = req.veterinarian.id;

  const patient = await Patient.findById(id);

  if (!patient) return res.json({ status: false, code: "patient_not_found" });

  if (patient.veterinarian.toString() !== veterinarian)
    return res.status(404).json({ status: false, code: "invalid_action" });

  res.json({ status: true, patient });
};
const getPatients = async (req, res) => {
  try {
    const veterinarian = req.veterinarian.id;
    
    const patients = await Patient.find()
      .where("veterinarian")
      .equals(veterinarian);

    res.json({ patients });
  } catch (error) {
    res.status(404).json({
      status: false,
      code: "patients_not_found",
      error: error.message,
    });
  }
};

/* ==========POST========== */
const addPatient = async (req, res) => {
  const { name, owner, email, symptoms } = req.body;

  try {
    const patient = new Patient(req.body);

    patient.veterinarian = req.veterinarian.id;

    const patientSaved = await patient.save();

    return res.json({
      status: true,
      code: "Patient added",
      patient: patientSaved,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      code: "Patient not added",
      error: error.message,
    });
  }
};

/* ==========PUT========== */
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, owner, email, dischargeDate, symptoms } = req.body;
  const veterinarian = req.veterinarian.id;

  const patient = await Patient.findById(id);

  if (!patient) return res.json({ status: false, code: "patient_not_found" });

  if (patient.veterinarian.toString() !== veterinarian)
    return res.status(404).json({ status: false, code: "invalid_action" });

  patient.name = name || patient.name;
  patient.owner = owner || patient.owner;
  patient.email = email || patient.email;
  patient.dischargeDate = dischargeDate || patient.dischargeDate;
  patient.symptoms = symptoms || patient.symptoms;

  try {
    const patientUpdatee = await patient.save();

    res.json({
      success: true,
      code: "patient_updated",
      patient: patientUpdatee,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      code: "patient_not_updated",
      error: error.message,
    });
  }
};

/* ==========DELETE========== */
const deletePatient = async (req, res) => {
  const { id } = req.params;
  const veterinarian = req.veterinarian.id;

  const patient = await Patient.findById(id);

  if (!patient) return res.json({ status: false, code: "patient_not_found" });

  if (patient.veterinarian.toString() !== veterinarian)
    return res.status(404).json({ status: false, code: "invalid_action" });

  try {
    await patient.deleteOne();

    res.json({
      success: true,
      code: "patient_deleted",
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      code: "patient_not_deleted",
      error: error.message,
    });
  }
};

export { getPatients, addPatient, getPatient, updatePatient, deletePatient };
