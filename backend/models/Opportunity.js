import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["internship","hackathon","scholarship","competition"],
    required: true
  },

  company: String,

  stipend: String,

  duration: String,

  deadline: Date,

  link: String,

  image: String,

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  tags: [
    {
      type: String
    }
  ],
  registrationLink: {
    type: String
  },  
  status: {
    type: String,
    enum: ["active","closed","hidden"],
    default: "active"
  }
},
{
  timestamps: true
}
);

export default mongoose.model("Opportunity", opportunitySchema);
