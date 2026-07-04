import { AuthUser } from "../middleware/auth.middleware";
import { Response } from 'express';
import { User } from "../models/user.model";

export async function getCurrentUser(req: AuthUser, res: Response) {
    try {
        const currentUser = await User.findOne({ _id: req.user?.user_id });

        res.status(200).json({
            created_at: currentUser?.created_at,
            email: currentUser?.email,
            profile_picture: currentUser?.profile_picture,
            user_id: currentUser?._id,
            username: currentUser?.username
        });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}