import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/User.model.js";
import { getPagination } from "../Utils/pagination.js";

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

const userRegister = asyncHandler(async(req,res)=>{
  try {
    
      const { Name , email , password , mobile } = req.body;
      //console.log("BODY:", req.body);
      
      
      if(!Name || !email || !password || !mobile){
  
          throw new apiError(400,"Fill All The Required Fields..");
      }

     const userExisted =  await User.findOne({ email });
  
      if(userExisted){
          throw new apiError(400,"User Is Already Existed..");
      }
  
      const user = await User.create({
          Name,
          email,
          password,
          mobile
      });

      return res.status(200)
                .json(new apiResponse(200,user,"User Registered Sucessfully.."));

  } catch (error) {
     console.error("REGISTER ERROR ", error);
    throw error;
  }
});

const loginUser = asyncHandler(async(req,res)=>{
    
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

const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 }
  });

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged out successfully"));
});

const getProfile = asyncHandler(async(req,res) => {

    const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate("followers following", "Name avatar");

    return res.status(200)
              .json(new apiResponse(200 , user , "User Profile Fetch Sucessfully.."))

});

export { userRegister , loginUser , logoutUser , getProfile};