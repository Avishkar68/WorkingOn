import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  location: String,

  eventType: {
    type: String,
    enum: ["workshop","hackathon","seminar","meetup"],
    required: true
  },

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  image: String,

  registeredUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      
      attendanceStatus: {
        type: String,
        enum: ["registered","attended","cancelled"],
        default: "registered"
      }
    }
  ],

  capacity: Number,

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
    enum: ["active","completed","cancelled"],
    default: "active"
  }
},
{
  timestamps: true
}
);

eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });

export default mongoose.model("Event", eventSchema);
