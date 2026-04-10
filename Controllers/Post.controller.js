import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { apiError } from "../Utils/apiError.js";
import { Post } from "../Models/Post.model.js";
// import { User } from "../Models/User.model.js";
import { Comment } from "../Models/Comment.model.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";

const createPost = asyncHandler(async (req,res) => {

  const { caption } = req.body || {};

  if (!req.file) {
    throw new apiError(400, "Image is required");
  }

  const result = await uploadOnCloudinary(req.file.buffer, "posts");

  if (!result) {
    throw new apiError(500, "Failed to upload image");
  }

  const post = await Post.create({
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
    caption,
    author: req.user._id,
  });

  return res.status(201)
            .json(new apiResponse(201, post, "Post created successfully"));
});

const getPost = asyncHandler(async(req,res) => {

     const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const [posts, totalPosts] = await Promise.all([
    Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    Post.countDocuments()
  ]);

  return res.status(200).json(
    new apiResponse(200, {
      posts,
      pagination: {
        totalPosts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalPosts / limit),
      }
    }, "All posts fetched successfully")
  );
});

const deletePost = asyncHandler(async(req,res) => {

    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) throw new apiError(404, "Post not found");

    if (post.author.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized");
    }

    //await uploadOnCloudinary.uploader.destroy(post.image.public_id);

    await post.deleteOne();

    return res.status(200)
              .json(new apiResponse(200, {}, "Post deleted successfully"));

});

const isLiked = asyncHandler(async(req,res)=>{

    const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) throw new apiError(404, "Post not found");

  const isLiked = post.likes.includes(req.user._id);

  if (isLiked) {
    post.likes.pull(req.user._id);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  return res.status(200)
            .json(new apiResponse(200,post,"Post Liked.."))
});

const addComment = asyncHandler(async(req,res)=>{

  const { content } = req.body;
  const { postId } = req.params;

  if (!content) throw new apiError(400, "Content required");

  const comment = await Comment.create({
    content,
    post: postId,
    user: req.user._id
  });

  return res.status(200)
            .json(new apiResponse(200,comment,"Comment Added Sucess...."))
});

const deleteComment = asyncHandler(async(req,res)=>{

  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new apiError(404, "Comment not found");
  }
  
  if (comment.user.toString() !== req.user._id.toString()) {
    throw new apiError(403, "Unauthorized");
  }

  await comment.deleteOne();

  return res.status(200)
            .json(new apiResponse(200,comment,"Comment Delete Sucess.."))
})

// const getFeed = asyncHandler(async (req, res) => {
  
//   const { page = 1, limit = 10 } = req.query;

//   const skip = (page - 1) * limit;

//   const user = await User.findById(req.user._id);

//   if (!user) {
//     throw new apiError(404, "User not found");
//   }

//   const usersForFeed = [...user.following, req.user._id];

//   const [posts, totalPosts] = await Promise.all([
//     Post.find({
//       author: { $in: usersForFeed }
//     })
//       .populate("author", "username email avatar")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit)),

//     Post.countDocuments({
//       author: { $in: usersForFeed }
//     })
//   ]);

//   return res.status(200).json(
//     new apiResponse(
//       200,
//       {
//         posts,
//         pagination: {
//           totalPosts,
//           currentPage: Number(page),
//           totalPages: Math.ceil(totalPosts / limit),
//         }
//       },
//       "Feed fetched successfully"
//     )
//   );
// });

export { createPost , getPost , deletePost , isLiked , addComment , deleteComment };