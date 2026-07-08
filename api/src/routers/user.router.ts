import { Router } from "express";
import { changeUser, deleteOldProfilePicture, deleteUser } from "../controllers/user.controller";
import { getCurrentUser } from "../views/user.view";
import { verifyToken } from "../middleware/auth.middleware";
import { uploadFile } from "../middleware/upload.middleware";

const userRouters = Router();

userRouters.delete('/rm', verifyToken, deleteUser);
userRouters.delete('/rm-profile', verifyToken, deleteOldProfilePicture);
userRouters.get('/show', verifyToken, getCurrentUser);
userRouters.put('/remake', verifyToken, uploadFile, changeUser);

export default userRouters;