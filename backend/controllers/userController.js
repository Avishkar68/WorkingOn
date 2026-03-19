import User from "../models/User.js";

export const getUserProfile = async (req, res) => {

  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers following", "name profileImage");

  res.json(user);

};


export const updateProfile = async (req, res) => {

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.body.bio !== undefined) {
    user.bio = req.body.bio;
  }

  if (req.body.skills !== undefined) {
    user.skills = req.body.skills;
  }

  if (req.body.profileImage !== undefined) {
    user.profileImage = req.body.profileImage;
  }

  const updatedUser = await user.save();

  res.json(updatedUser);

};


export const followUser = async (req, res) => {

  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!userToFollow.followers.includes(currentUser._id)) {

    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userToFollow._id);

    await userToFollow.save();
    await currentUser.save();

  }

  res.json({ message: "Followed" });

};


export const unfollowUser = async (req, res) => {

  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  userToUnfollow.followers.pull(currentUser._id);
  currentUser.following.pull(userToUnfollow._id);

  await userToUnfollow.save();
  await currentUser.save();

  res.json({ message: "Unfollowed" });

};


export const getFollowers = async (req, res) => {

  const user = await User.findById(req.params.id)
    .populate("followers", "name profileImage");

  res.json(user.followers);

};


export const getFollowing = async (req, res) => {

  const user = await User.findById(req.params.id)
    .populate("following", "name profileImage");

  res.json(user.following);

};