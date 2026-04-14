import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js"
import { Post } from "../Models/Post.model.js";
import { User } from "../Models/User.model.js";
import { getPagination } from "../Utils/pagination.js";
import cloudinary from "../Config/cloudinary.js";

const createPost = asyncHandler(async(req,res) => {

    const { content } = req.body;

    if(!req.file){
        throw new apiError(400,"Media Is Required...");
    }

    //Upload File On Cloudinaryyy
    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    const post = await Post.create({
        content,
        media: uploadResult.secure_url,
        owner: req.user._id
  });

    return res.status(200)
              .json(new apiResponse(200,post,"Post Added Sucessfully..."))
});

const deletePost = asyncHandler(async(req,res) => {

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new apiError(404, "Post Not Found");
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Not Authorized");
    }

    await post.deleteOne();

    return res.status(200)
              .json(new apiResponse(200,post,"Post Deleted Sucessfully..."));

});

const likeUnlike = asyncHandler(async(req,res) => {

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
        post.likes.pull(req.user._id);
    } else {
        post.likes.push(req.user._id);
    }

    await post.save();

    return res.status(200)
              .json(new apiResponse(200,{},
                        isLiked ? "Unliked" : "Liked"))
});

//Following Users Posts...
const getFeed = asyncHandler(async(req,res) => {

    const { page = 1, limit = 10 } = req.query;

    const { skip } = getPagination(page, limit);

    const currentUser = await User.findById(req.user._id);

    const posts = await Post.find({
        owner: { $in: currentUser.following }
    })
        .populate("owner", "Name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200)
              .json(new apiResponse(200,posts,"Feed Fetch Sucessfuly..."))

});

const getMyPosts = asyncHandler(async(req,res) => {

    const posts = await Post.find({ owner: req.user._id })
    .sort({ createdAt: -1 });

    return res.status(200)
              .json(new apiResponse(200,posts,"My Posts Fetch Sucessfully..."))

});

export { createPost , deletePost , likeUnlike , getFeed , getMyPosts}