import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller";

const authRouters = Router();

authRouters.post('/sign-in', signIn);
authRouters.post('/sign-out', signOut);
authRouters.post('/sign-up', signUp);

export default authRouters;