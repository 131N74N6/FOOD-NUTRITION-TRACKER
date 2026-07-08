import { AuthUser } from "../middleware/auth.middleware";
import { Response } from 'express';
import { User } from "../models/user.model";
import { Results } from "../models/result.model";
import { v2 } from "cloudinary";
import { uploadToCloudinary } from "../services/cloudinary.service";

export async function changeUser(req: AuthUser, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const currentUser = await User.findOne({ _id: currentUserId });
        if (!currentUser) return res.status(404).json({ message: "user not found" });

        const { username } = req.body;
        const image = req.file as Express.Multer.File | undefined;

        if (image) {
            if (currentUser.profile_picture?.public_id) {
                await v2.uploader.destroy(
                    currentUser.profile_picture.public_id, 
                    { resource_type: currentUser.profile_picture.resource_type || 'image' }
                );
            }

            const uploadResult = await uploadToCloudinary({ 
                fileBuffer: image.buffer, 
                folder: "user_profile", 
                originalName: image?.originalname! 
            });

            await User.updateOne({ _id: currentUserId }, {
                $set: { 
                    profile_picture: uploadResult, 
                    username: username || `user-${Date.now()}` 
                }
            });
        } else {
            await User.updateOne({ _id: currentUserId }, {
                $set: { 
                    username: username || `user-${Date.now()}` 
                }
            });
        }

        res.status(200).json({ message: "user updated successfully" });
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteOldProfilePicture(req: AuthUser, res: Response) {
    try {
        const { imageToDelete } = req.body;
        const currentUser = await User.findOne({ _id: req.user?.user_id });
        if (!currentUser) return res.status(404).json({ message: "user not found" });

        await v2.uploader.destroy(
            imageToDelete.profile_picture.public_id, 
            { resource_type: imageToDelete.profile_picture.resource_type }
        );

        await User.updateOne({ _id: currentUser._id }, {
            $unset: { profile_picture: '' }
        });
        
        res.status(200).json({ message: "profile picture deleted sucessfuly" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteUser(req: AuthUser, res: Response) {
    try {
        const currentUser = await User.findOne({ _id: req.user?.user_id });
        if (!currentUser) return res.status(404).json({ message: "user not found" });

        const results = await Results.find({ user_id: currentUser?._id });
        const deletePromises = results.map(result => {
            return v2.uploader.destroy(result.image.public_id, { 
                resource_type: result.image.resource_type 
            });
        });

        await Promise.all ([
            ...deletePromises,
            Results.deleteMany({ user_id: currentUser?._id }),
            v2.uploader.destroy(currentUser.profile_picture.public_id, { 
                resource_type: currentUser.profile_picture.resource_type 
            }),
            User.deleteOne({ _id: currentUser?._id })
        ]);

        res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}