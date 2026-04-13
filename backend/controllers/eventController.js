// import Event from "../models/Event.js";
// import { createNotification } from "../services/notificationService.js";

// export const createEvent = async (req, res) => {

//   const {
//     title,
//     description,
//     date,
//     location,
//     eventType,
//     image,
//     capacity,
//     tags,
//     registrationLink
//   } = req.body;

//   const event = await Event.create({
//     title,
//     description,
//     date,
//     location,
//     eventType,
//     image,
//     capacity,
//     tags,
//     registrationLink,
//     organizer: req.user._id
//   });

//   res.status(201).json(event);

// };


  

//   export const getEvents = async (req, res) => {

//     const events = await Event.find({
//       status: "active"
//     })
//       .populate("organizer", "name profileImage")
//       .sort({ date: 1 });
  
//     res.json(events);
  
//   };
  

//   export const getEventById = async (req, res) => {

//     const event = await Event.findById(req.params.id)
//       .populate("organizer", "name profileImage")
//       .populate("registeredUsers.user", "name profileImage");
  
//     res.json(event);
  
//   };
  

//   export const registerEvent = async (req, res) => {

//     const event = await Event.findById(req.params.id);
  
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }
  
//     const alreadyRegistered = event.registeredUsers.find(
//       r => r.user.toString() === req.user._id.toString()
//     );
  
//     if (alreadyRegistered) {
//       return res.status(400).json({ message: "Already registered" });
//     }
  
//     if (event.capacity && event.registeredUsers.length >= event.capacity) {
//       return res.status(400).json({ message: "Event full" });
//     }
  
//     event.registeredUsers.push({
//       user: req.user._id,
//       attendanceStatus: "registered"
//     });
  
//     await event.save();
  
//     await createNotification(
//       event.organizer,
//       req.user._id,
//       "eventRegistration",
//       "registered for your event",
//       event._id,
//       "Event"
//     );
  
//     res.json({ message: "Registered successfully" });
  
//   };

//   export const cancelRegistration = async (req, res) => {

//     const event = await Event.findById(req.params.id);
  
//     event.registeredUsers = event.registeredUsers.filter(
//       r => r.user.toString() !== req.user._id.toString()
//     );
  
//     await event.save();
  
//     res.json({ message: "Registration cancelled" });
  
//   };
  
//   export const getUserEvents = async (req, res) => {
//     try {
//       const events = await Event.find({
//         organizer: req.params.id   // ✅ FIXED
//       }).sort({ createdAt: -1 });
  
//       res.json(events);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   export const deleteEvent = async (req,res)=>{

//     const event = await Event.findById(req.params.id)
  
//     if(!event){
//       return res.status(404).json({message:"Not found"})
//     }
  
//     if(event.organizer.toString() !== req.user._id.toString()){
//       return res.status(403).json({message:"Not allowed"})
//     }
  
//     await event.deleteOne()
  
//     res.json({message:"Event deleted"})
//   }



import Event from "../models/Event.js";
import uploadImage from "../utils/uploadImage.js";
import { createNotification } from "../services/notificationService.js";

// ✅ CREATE EVENT (SAFE + IMAGE UPLOAD)
export const createEvent = async (req, res) => {
  try {

    // ✅ prevent crash if body undefined
    const body = req.body || {};

    const {
      title,
      description,
      date,
      location,
      eventType,
      capacity,
      registrationLink
    } = body;

    // ✅ basic validation
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrl = "";

    // ✅ HANDLE IMAGE
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    }

    // ✅ SAFE TAG PARSE
    let parsedTags = [];
    if (body.tags) {
      try {
        parsedTags = JSON.parse(body.tags);
      } catch {
        parsedTags = [];
      }
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      eventType,
      image: imageUrl,
      capacity: capacity || undefined,
      tags: parsedTags,
      registrationLink,
      organizer: req.user._id
    });

    res.status(201).json(event);

  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({ message: "Event creation failed" });
  }
};


// ✅ GET ALL EVENTS
export const getEvents = async (req, res) => {

  const events = await Event.find({
    status: "active"
  })
    .populate("organizer", "name profileImage")
    .sort({ date: 1 });

  res.json(events);
};


// ✅ GET SINGLE EVENT
export const getEventById = async (req, res) => {

  const event = await Event.findById(req.params.id)
    .populate("organizer", "name profileImage")
    .populate("registeredUsers.user", "name profileImage");

  res.json(event);
};


// ✅ REGISTER EVENT
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


// ✅ CANCEL REGISTRATION
export const cancelRegistration = async (req, res) => {

  const event = await Event.findById(req.params.id);

  event.registeredUsers = event.registeredUsers.filter(
    r => r.user.toString() !== req.user._id.toString()
  );

  await event.save();

  res.json({ message: "Registration cancelled" });
};


// ✅ GET USER EVENTS
export const getUserEvents = async (req, res) => {
  try {

    const events = await Event.find({
      organizer: req.params.id
    })
    .populate("organizer", "name profileImage branch year")
    .sort({ createdAt: -1 });

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ DELETE EVENT
export const deleteEvent = async (req, res) => {

  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Not found" });
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await event.deleteOne();

  res.json({ message: "Event deleted" });
};
