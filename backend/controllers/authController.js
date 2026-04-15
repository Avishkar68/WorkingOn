import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import uploadImage from "../utils/uploadImage.js";

export const registerUser = async (req, res) => {
  try {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const branch = req.body.branch;
    const year = req.body.year;

    if (!email.endsWith("@spit.ac.in")) {
      return res.status(400).json({ message: "Only SPIT email allowed" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ HANDLE IMAGE
    const userData = {
      name,
      email,
      password: hashedPassword,
      branch,
      year,
    };

    if (req.file) {
      userData.profileImage = await uploadImage(req.file.path);
    }

    // ✅ CREATE USER
    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};


export const loginUser = async (req, res) => {

    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
  
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  
  };
  

  export const verifyEmail = async (req, res) => {

    const { email, code } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }
  
    user.emailVerified = true;
    user.verificationCode = null;
  
    await user.save();
  
    res.json({ message: "Email verified" });
  
  };
  
  export const forgotPassword = async (req, res) => {

    const { email } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
  
    await user.save();
  
    res.json({ resetToken });
  
  };
  

  export const resetPassword = async (req, res) => {

    const { token, newPassword } = req.body;
  
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
  
    await user.save();
  
    res.json({ message: "Password updated" });
  
  };
  export const getCurrentUser = async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  export const changePassword = async (req, res) => {

    const { currentPassword, newPassword } = req.body;
  
    const user = await User.findById(req.user._id);
  
    const isMatch = await bcrypt.compare(currentPassword, user.password);
  
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  
    await user.save();
  
    res.json({ message: "Password updated successfully" });
  
  };