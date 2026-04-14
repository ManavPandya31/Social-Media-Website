import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

//   console.log("cloud_name :", process.env.CLOUDINARY_NAME);
//   console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
//   console.log("api_secret:", process.env.CLOUDINARY_SECRET_KEY);
    
export default cloudinary;