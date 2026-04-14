import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/User.model.js";
import { Post } from "../Models/Post.model.js";

const getAllUsers = asyncHandler(async(req,res) => {

    const users = await User.find().select("-password -refreshToken");

    return res.status(200)
              .json(new apiResponse(200,users,"All Users Fetch Sucessfully..."));
});

const deletePost = asyncHandler(async(req,res) => {

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post){
        throw new apiError(404, "Post Not Found");
    }

    await post.deleteOne();

    return res.status(200)
              .json(new apiResponse(200,post,"Post Delete Sucessfully..."));
});

const banUser = asyncHandler(async(req,res) => {

    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
        userId,
        { role: "banned" },
        { new: true }
    );

    if (!user) {
        throw new apiError(404, "User not found");
    }

    return res.status(200)
              .json(new apiResponse(200,user,"User banned!!"));
});

export { getAllUsers , deletePost , banUser}