import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /@spit\.ac\.in$/
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  bio: {
    type: String,
    default: ""
  },

  profileImage: {
    type: String,
    default: "https://thumbs.dreamstime.com/b/anonimos-icon-profie-social-network-over-color-background-differnt-uses-purple-icon-social-profile-148257420.jpg"
  },

  branch: {
    type: String,
    enum: [
      "Computer Engineering",
      "Computer Science and Engineering",
      "Electronics Engineering"
    ],
    default: "Computer Engineering"
  },

  year: {
    type: Number,
    enum: [1,2,3,4],
    default: 1
  },

  skills: [
    {
      type: String
    }
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  isAdmin: {
    type: Boolean,
    default: false
  },

  isBanned: {
    type: Boolean,
    default: false
  },

  emailVerified: {
    type: Boolean,
    default: false
  },

  verificationCode: String,

  resetToken: String,

  resetTokenExpiry: Date
},
{
  timestamps: true
}
);

export default mongoose.model("User", userSchema);
