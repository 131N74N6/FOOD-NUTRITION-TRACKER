import { Router } from "express";
import { register, signIn, signOut } from "../controllers/auth.controller";

const authRouters = Router();

authRouters.post('/register', register);
authRouters.post('/sign-in', signIn);
authRouters.post('/sign-out', signOut);

export default authRouters;