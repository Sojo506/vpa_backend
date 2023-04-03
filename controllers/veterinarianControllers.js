import Veterinarian from "../models/Veterinarian.js";
import { generateJWT } from "../utils/generateJWT.js";
import { generateId } from "../utils/generateId.js";
import emailRegister from "../utils/emailRegister.js";
import emailForgotPassword from "../utils/emailForgotPassword.js";

/* ==========POST========== */
/* REGISTER USER */
const register = async (req, res) => {
  const { name, email } = req.body;

  // check if an user is already registered
  const userExist = await Veterinarian.findOne({ email });

  if (userExist)
    return res.status(400).json({ success: false, code: "User already exist" });

  try {
    // save user
    const veterinarian = new Veterinarian(req.body);
    const savedVeterinarian = await veterinarian.save();

    // send email
    await emailRegister({
      email,
      name,
      token: savedVeterinarian.token,
    });

    res.json({ success: true, code: "User registered" });
  } catch (error) {
    res.json({
      success: false,
      code: "User not registered",
      error: error.message,
    });
  }
};
/* AUTHENTICATE USER */
const login = async (req, res) => {
  const { email, password } = req.body;

  // check if the user exist
  const userExist = await Veterinarian.findOne({ email });
  if (!userExist)
    return res.status(403).json({ success: false, code: "User doesn't exist" });

  // check if the user is confirmed
  if (!userExist.confirmed)
    return res.status(403).json({ success: false, code: "User not confirmed" });

  // check if the password is correct
  if (await userExist.checkPassword(password)) {
    res.json({
      success: true,
      code: "user_authenticated",
      profile: {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        token: generateJWT(userExist.id),
      },
    });
  } else
    res
      .status(403)
      .json({ success: false, code: "Email or Password is incorrect" });
};
/* SEND EMAIL */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const userExist = await Veterinarian.findOne({ email });
  if (!userExist)
    return res.status(403).json({ success: false, code: "User doesn't exist" });

  try {
    userExist.token = generateId();
    await userExist.save();

    // send email
    emailForgotPassword({
      email,
      name: userExist.name,
      token: userExist.token,
    });

    res.json({ success: true, code: "email_send" });
  } catch (error) {
    return res.json({ success: false, code: "email_couldn't_send" });
  }
};
/* CHANGE PASSWORD FROM EMAIL */
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinarian = await Veterinarian.findOne({ token });
  if (!veterinarian)
    return res.status(400).json({ success: false, code: "invalid_token" });

  try {
    veterinarian.token = null;
    veterinarian.password = password;
    await veterinarian.save();

    res.json({ success: true, code: "Your password has been modified" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, code: "password_couldn't_reset" });
  }
};

/* ==========PUT========== */
/* UPDATE USER */
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, lastName, web, phone, email } = req.body;

  const veterinarian = await Veterinarian.findById(id);

  if (!veterinarian)
    return res.status(400).json({ success: false, code: "User not found" });

  if (veterinarian.email !== email) {
    const emailExist = await Veterinarian.findOne({ email });
    if (emailExist)
      return res
        .status(400)
        .json({ success: false, code: "User email already exist" });
  }

  try {
    veterinarian.name = name;
    veterinarian.lastName = lastName;
    veterinarian.web = web;
    veterinarian.phone = phone;
    veterinarian.email = email;

    const veterinarianUpdated = await veterinarian.save();

    res.json({
      success: true,
      code: "User updated",
      profile: veterinarianUpdated,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      code: "User not updated",
    });
  }
};
/* UPDATE PASSWORD FROM PROFILE */
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.veterinarian;

  const veterinarian = await Veterinarian.findById(id);
  if (!veterinarian)
    return res.status(403).json({ success: false, code: "User doesn't exist" });

  if (await veterinarian.checkPassword(currentPassword)) {
    veterinarian.password = newPassword;
    await veterinarian.save();
    res.json({ success: true, code: "Password changed" });
  } else {
    res
      .status(400)
      .json({ success: false, code: "Your current password is incorrect" });
  }
};

/* ==========GET========== */
/* GET USER*/
const profile = (req, res) => {
  res.json({ success: true, code: "user_got", profile: req.veterinarian });
};
/* CONFIRM USER */
const confirm = async (req, res) => {
  const { token } = req.params;

  const confirmUser = await Veterinarian.findOne({ token });

  if (!confirmUser) {
    const error = new Error("invalid_token");
    return res.status(404).json({ success: false, code: error.message });
  }

  try {
    confirmUser.token = null;
    confirmUser.confirmed = true;

    await confirmUser.save();

    res.json({ success: true, code: "user_confirmed" });
  } catch (error) {
    return res.json({ success: false, code: "user_not_confirmed" });
  }
};
const forgotPasswordToken = async (req, res) => {
  const { token } = req.params;

  const checkUserToken = await Veterinarian.findOne({ token });
  if (!checkUserToken)
    return res.status(400).json({ success: false, code: "invalid_token" });

  res.json({ success: true, code: "valid_token" });
};

export {
  register,
  profile,
  confirm,
  login,
  forgotPassword,
  forgotPasswordToken,
  newPassword,
  updateProfile,
  updatePassword,
};
