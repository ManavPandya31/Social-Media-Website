import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { Story } from "../Models/Story.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";

const createUserStory = asyncHandler(async (req, res) => {

    // console.log("FILE:", req.file);
    // console.log("BODY:", req.body);

    const fileBuffer = req.file?.buffer;

    if (!fileBuffer) {
        throw new apiError(400, "Media file is required..");
    }

    const uploadedMedia = await uploadOnCloudinary(fileBuffer, "stories");

    if (!uploadedMedia) {
        throw new apiError(500, "Cloudinary upload failed");
    }

    const story = await Story.create({
        user: req.user._id,
        media: uploadedMedia.secure_url,
        public_id: uploadedMedia.public_id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json(
        new apiResponse(200, story, "Story Added successfully")
    );
});

const getUsersStory = asyncHandler(async(req,res) => {

     const stories = await Story.find()
        .populate("user", "userName avtar")
        .sort({ createdAt: -1 });
    
    return res.status(200)
              .json(new apiResponse(200,stories,"Storys Fetch Sucessfully.."));
});

const deleteUserStory = asyncHandler(async(req,res) => {

    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
        throw new apiError(404, "Story Not Found");
    }

    if (story.user.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Not Authorized");
    }

    await story.deleteOne();

    return res.status(200)
              .json(new apiResponse(200,story,"Story Delete Sucessfully.."))

});

export { createUserStory , getUsersStory , deleteUserStory}