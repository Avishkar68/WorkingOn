import User from "../models/User.js";
import uploadImage from "../utils/uploadImage.js";
import { supabase } from "../config/supabase.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, branch, year, supabaseId } = req.body;

    if (!email || !email.endsWith("@spit.ac.in")) {
      return res.status(400).json({ message: "Only SPIT email allowed" });
    }

    if (supabaseId) {
      const userBySupabaseId = await User.findOne({ supabaseId });
      if (userBySupabaseId) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.supabaseId && user.supabaseId !== supabaseId) {
        return res.status(400).json({ message: "An account with this email is already linked to another authentication provider. Please log in." });
      }

      // Update existing legacy user profile with supabaseId and new details
      user.supabaseId = supabaseId;
      user.emailVerified = true;
      if (name) user.name = name;
      if (branch) user.branch = branch;
      if (year) user.year = year;
      if (req.file) {
        user.profileImage = await uploadImage(req.file.path);
      }
      await user.save();
      console.log(`[Auth Controller] Linked legacy user ${email} with Supabase ID ${supabaseId} during registration`);

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      });
    }

    const userData = {
      name,
      email,
      branch,
      year,
      supabaseId,
      emailVerified: false
    };

    if (req.file) {
      userData.profileImage = await uploadImage(req.file.path);
    }

    const newUser = await User.create(userData);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileImage: newUser.profileImage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Supabase session token is required" });
  }

  try {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    if (error || !supabaseUser) {
      throw new Error(error ? error.message : "User not found on Supabase");
    }

    if (!supabaseUser.email || !supabaseUser.email.endsWith("@spit.ac.in")) {
      return res.status(403).json({ message: "Only SPIT emails (@spit.ac.in) are allowed" });
    }

    let user = await User.findOne({ supabaseId: supabaseUser.id });
    if (!user) {
      // Sync logic for migrating existing user by email
      user = await User.findOne({ email: supabaseUser.email });
      if (user) {
        user.supabaseId = supabaseUser.id;
        user.emailVerified = true;
        await user.save();
        console.log(`[Auth Controller] Linked existing user ${user.email} with Supabase ID ${supabaseUser.id}`);
      } else {
        return res.status(200).json({ profileExists: false, email: supabaseUser.email, supabaseId: supabaseUser.id });
      }
    } else if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token: token,
    });
  } catch (err) {
    console.error("Login Supabase verification error:", err.message);
    return res.status(401).json({ message: "Invalid Supabase token" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user && req.supabaseUser) {
      return res.json({ profileExists: false, email: req.supabaseUser.email });
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};