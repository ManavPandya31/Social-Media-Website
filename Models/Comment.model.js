import mongoose , { Schema } from "mongoose";

const commentSchema = new Schema({

    content: {
      type: String,
      required: true,
      trim: true
    },

    comment_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true
    }

    },{timestamps : true}

);
commentSchema.index({ post: 1, createdAt: -1 });

export const Comment = mongoose.model("Comment",commentSchema);