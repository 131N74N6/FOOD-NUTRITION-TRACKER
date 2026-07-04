import { AuthUser } from "../middleware/auth.middleware";
import { Response } from 'express';
import { User } from "../models/user.model";
import { Results } from "../models/result.model";
import { v2 } from "cloudinary";
import { uploadToCloudinary } from "../services/cloudinary.service";

export async function changeUser(req: AuthUser, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const { username } = req.body;
        const image = req.file as Express.Multer.File | undefined;

        const uploadResult = await uploadToCloudinary({ 
            fileBuffer: image?.buffer!, 
            folder: "user_profile", 
            originalName: image?.originalname! 
        });

        await User.updateOne({ _id: currentUserId }, {
            $set: { image: uploadResult, username }
        });

        res.status(200).json({ message: "user updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteUser(req: AuthUser, res: Response) {
    try {
        const currentUser = await User.findOne({ _id: req.user?.user_id });
        const results = await Results.find({ user_id: currentUser?._id });
        const deletePromises = results.map(result => {
            return v2.uploader.destroy(result.image.public_id, { resource_type: result.image.resource_type });
        });

        await Promise.all ([
            ...deletePromises,
            Results.deleteMany({ user_id: currentUser?._id }),
            User.deleteOne({ _id: currentUser?._id })
        ]);

        res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}