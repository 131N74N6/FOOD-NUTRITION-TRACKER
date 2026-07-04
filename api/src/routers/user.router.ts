import { Router } from "express";
import { changeUser, deleteUser } from "../controllers/user.controller";
import { getCurrentUser } from "../views/user.view";
import { verifyToken } from "../middleware/auth.middleware";

const userRouters = Router();

userRouters.delete('/rm', verifyToken, deleteUser);
userRouters.get('/show', verifyToken, getCurrentUser);
userRouters.put('/remake', verifyToken, changeUser);

export default userRouters;