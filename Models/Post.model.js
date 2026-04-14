import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },

    media: {
      type: String, 
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  
  { timestamps: true },
);

postSchema.index({ createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
