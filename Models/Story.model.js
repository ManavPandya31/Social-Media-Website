import mongoose , { Schema } from "mongoose";

const storySchema = new Schema({

        user : {
            type : Schema.Types.ObjectId,
            ref : "User",
        },

        media: {
            type: String, 
            required: true,
        },

        // caption: {
        //     type: String,
        //     default: "",
        // },

        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 60 * 24,
        },
},

    {timestamps : true});

export const Story = mongoose.model("Story",storySchema);