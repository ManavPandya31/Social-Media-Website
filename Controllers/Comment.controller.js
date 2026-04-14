import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js"
import { apiResponse } from "../Utils/apiResponse.js"
import { Comment } from "../Models/Comment.model.js"
import { Post } from "../Models/Post.model.js"
import { getPagination } from "../Utils/pagination.js";

const addComment = asyncHandler(async(req,res) => {

     const { postId } = req.params;
     const { content } = req.body;

     if (!content) {
         throw new apiError(400, "Comment Required");
     }

     const post = await Post.findById(postId);
  
     if (!post) throw new apiError(404, "Post Not Found");

     const comment = await Comment.create({
         content,
         comment_user: req.user._id,
         post: postId
    });

    return res.status(200)
              .json(new apiResponse(200,comment,"Comment Added Suceddfullyy..."));
});

const updateComment = asyncHandler(async(req,res) => {

    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new apiError(400, "Updated Content Is Required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new apiError(404, "Comment Not Found");
    }

    if (comment.comment_user.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Not Authorized To Update This Comment");
    }

    comment.content = content;

    await comment.save();

    return res.status(200)
              .json(new apiResponse(200,comment,"Comment Update Sucessfully..."));
});

const deleteComment = asyncHandler(async(req,res) => {

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) throw new apiError(404, "Comment not found");

    if (comment.comment_user.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Not authorized");
    }

    await comment.deleteOne();

    return res.status(200)
              .json(new apiResponse(200,comment,"Comment Delete Sucessfully.."));
});

const getComments = asyncHandler(async(req,res) => {

    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { skip } = getPagination(page, limit);

    const comments = await Comment.find({ post: postId })
        .populate("comment_user", "Name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200)
              .json(new apiResponse(200,comments,"Coments Fetched Sucessfully..."));
});

export { addComment , deleteComment , updateComment , getComments}