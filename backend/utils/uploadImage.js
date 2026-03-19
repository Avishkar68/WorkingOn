import cloudinary from "../config/cloudinary.js";

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file, {
    folder: "spit-connect",
  });

  return result.secure_url;
};

export default uploadImage;
