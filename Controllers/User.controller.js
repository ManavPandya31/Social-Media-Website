import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { apiError } from "../Utils/apiError.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { User } from "../Models/User.model.js";

 const options = {
                httpOnly : true,
                secure : true,
             };

const accessAndRefreshTokens = async(userId)=>{

   try {
     const user = await User.findById(userId);
     const accessToken = await user.generateAccessToken();
     const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;
         await user.save({ validateBeforeSave : false });

         return { accessToken , refreshToken }

   } catch (error) {
        throw new apiError(501,"Something Problem While Genarate Tokens");
   }

};

const registerUser = asyncHandler(async(req,res) => {

     const { userName , email , password , MobileNumber , gender } = req.body;

     if(!userName || !email || !password || !MobileNumber || !gender){
        throw new apiError(401,"Some Field Are Missing In Body...");
     }

     const ExistedUser = await User.findOne({ email })
     
        if(ExistedUser){
            throw new apiError(401,"This User Is Alrady Existed With This Email...");
        }

     const user = await User.create({ userName, email, password ,  MobileNumber , gender });

     return res.status(201)
               .json(new apiResponse(201,user,"User Register Sucessfully.."))   
});

const loginUser = asyncHandler(async(req,res) => {

    const { email , password } = req.body;

        if(!email || !password){
            throw new apiError(400,"Register Required First..");
        }

     const user = await User.findOne({email});

     if(!user){
        throw new apiError(400,"User Is Not Found..");
     }

     const isPasswordValid = await user.isPasswordCorrect(password);
            if(!isPasswordValid){
                throw new apiError(400,"Password Is Incorrect..");
            }

     const { accessToken , refreshToken } = await accessAndRefreshTokens(user._id);
             
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200)
                   .cookie("accessToken",accessToken,options)
                   .cookie("refreshToken",refreshToken,options)
                   .json(new apiResponse(200,  
                        { user: loggedInUser,accessToken,refreshToken },
                            "User Logged In Successfully"   
        )
    );

});

const createProfile = asyncHandler(async(req,res) => {

 const { bio, location } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  let avtarUrl;

  if (req.file) {
    const result = await uploadOnCloudinary(req.file.buffer, "avatars");

    if (!result) {
      throw new apiError(500, "Cloudinary upload failed");
    }

    avtarUrl = result.secure_url;
  }

  user.bio = bio || user.bio;
  user.location = location || user.location;
  user.avtar = avtarUrl || user.avtar;

  await user.save();

  return res.status(200)
            .json(new apiResponse(200,"Profile created Sucessfully.."))

});

export { registerUser , loginUser , createProfile }