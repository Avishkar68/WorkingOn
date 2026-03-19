import Opportunity from "../models/Opportunity.js";
import { createNotification } from "../services/notificationService.js";


export const createOpportunity = async (req, res) => {

  const {
    title,
    description,
    type,
    company,
    stipend,
    duration,
    deadline,
    tags,
    registrationLink
  } = req.body;

  const opportunity = await Opportunity.create({
    title,
    description,
    type,
    company,
    stipend,
    duration,
    deadline,
    tags,
    registrationLink,
    postedBy: req.user._id
  });

  res.status(201).json(opportunity);

};


  export const getOpportunities = async (req, res) => {

    const { type, tag } = req.query;
  
    let filter = { status: "active" };
  
    if (type) filter.type = type;
  
    if (tag) filter.tags = tag;
  
    const opportunities = await Opportunity.find(filter)
      .populate("postedBy", "name profileImage")
      .sort({ createdAt: -1 });
  
    res.json(opportunities);
  
  };

  export const getOpportunityById = async (req, res) => {

    const opportunity = await Opportunity.findById(req.params.id)
      .populate("postedBy", "name profileImage")
      .populate("applicants", "name profileImage");
  
    res.json(opportunity);
  
  };
  export const applyOpportunity = async (req, res) => {

    const opportunity = await Opportunity.findById(req.params.id);
  
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
  
    if (opportunity.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already applied" });
    }
  
    opportunity.applicants.push(req.user._id);
  
    await opportunity.save();
  
    await createNotification(
      opportunity.postedBy,
      req.user._id,
      "opportunityUpdate",
      "applied to your opportunity",
      opportunity._id,
      "Opportunity"
    );
  
    res.json({ message: "Application submitted" });
  
  };
  export const closeOpportunity = async (req, res) => {

    const opportunity = await Opportunity.findById(req.params.id);
  
    if (opportunity.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
  
    opportunity.status = "closed";
  
    await opportunity.save();
  
    res.json({ message: "Opportunity closed" });
  
  };
      
  export const getUserOpportunities = async (req, res) => {
    try {
      const opportunities = await Opportunity.find({
        postedBy: req.params.id   // ✅ FIXED
      }).sort({ createdAt: -1 });
  
      res.json(opportunities);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  export const deleteOpportunity = async (req,res)=>{

    const op = await Opportunity.findById(req.params.id)
  
    if(!op){
      return res.status(404).json({message:"Not found"})
    }
  
    if(op.postedBy.toString() !== req.user._id.toString()){
      return res.status(403).json({message:"Not allowed"})
    }
  
    await op.deleteOne()
  
    res.json({message:"Deleted"})
  }