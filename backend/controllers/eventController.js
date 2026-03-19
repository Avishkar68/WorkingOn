import Event from "../models/Event.js";
import { createNotification } from "../services/notificationService.js";

export const createEvent = async (req, res) => {

  const {
    title,
    description,
    date,
    location,
    eventType,
    image,
    capacity,
    tags,
    registrationLink
  } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    location,
    eventType,
    image,
    capacity,
    tags,
    registrationLink,
    organizer: req.user._id
  });

  res.status(201).json(event);

};


  

  export const getEvents = async (req, res) => {

    const events = await Event.find({
      status: "active"
    })
      .populate("organizer", "name profileImage")
      .sort({ date: 1 });
  
    res.json(events);
  
  };
  

  export const getEventById = async (req, res) => {

    const event = await Event.findById(req.params.id)
      .populate("organizer", "name profileImage")
      .populate("registeredUsers.user", "name profileImage");
  
    res.json(event);
  
  };
  

  export const registerEvent = async (req, res) => {

    const event = await Event.findById(req.params.id);
  
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
  
    const alreadyRegistered = event.registeredUsers.find(
      r => r.user.toString() === req.user._id.toString()
    );
  
    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }
  
    if (event.capacity && event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({ message: "Event full" });
    }
  
    event.registeredUsers.push({
      user: req.user._id,
      attendanceStatus: "registered"
    });
  
    await event.save();
  
    await createNotification(
      event.organizer,
      req.user._id,
      "eventRegistration",
      "registered for your event",
      event._id,
      "Event"
    );
  
    res.json({ message: "Registered successfully" });
  
  };

  export const cancelRegistration = async (req, res) => {

    const event = await Event.findById(req.params.id);
  
    event.registeredUsers = event.registeredUsers.filter(
      r => r.user.toString() !== req.user._id.toString()
    );
  
    await event.save();
  
    res.json({ message: "Registration cancelled" });
  
  };
  
  export const getUserEvents = async (req, res) => {
    try {
      const events = await Event.find({
        organizer: req.params.id   // ✅ FIXED
      }).sort({ createdAt: -1 });
  
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  export const deleteEvent = async (req,res)=>{

    const event = await Event.findById(req.params.id)
  
    if(!event){
      return res.status(404).json({message:"Not found"})
    }
  
    if(event.organizer.toString() !== req.user._id.toString()){
      return res.status(403).json({message:"Not allowed"})
    }
  
    await event.deleteOne()
  
    res.json({message:"Event deleted"})
  }