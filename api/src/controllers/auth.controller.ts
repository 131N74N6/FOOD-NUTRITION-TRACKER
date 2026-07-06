import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

export async function signIn(req: Request, res: Response) {
    try {
        const { password, username } = req.body;

        if (!password && !username) return res.status(400).json({ message: "all field required" });
        if (!password) return res.status(400).json({ message: "password is required" });
        if (!username) return res.status(400).json({ message: "username is required" });

        const userExist = await User.findOne({ username });
        if (!userExist) return res.status(404).json({ message: "user not found" });
        
        const isPasswordMatch = await bcrypt.compare(password, userExist?.password);
        if (!isPasswordMatch) return res.status(400).json({ message: "invalid password" });

        const token = jwt.sign(
            { user_id: userExist._id, username: userExist.username },
            process.env.JWT_KEY || 'secret_key',
            { expiresIn: '1d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ user_id: userExist._id });

    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function signOut(_: Request, res: Response) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ message: "successfuly sign out" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function signUp(req: Request, res: Response) {
    try {
        const created_at = new Date().toISOString();
        const { email, password, username } = req.body;

        if (!email && !password && !username) return res.status(400).json({ message: "all field required" });
        if (!email) return res.status(400).json({ message: "email is required" });
        if (!password) return res.status(400).json({ message: "password is required" });
        if (!username) return res.status(400).json({ message: "username is required" });

        const usernameExist = await User.findOne({ username });
        if (usernameExist) return res.status(409).json({ message: "this username already taken" });

        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(409).json({ message: "this email already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            created_at: created_at,
            email: email,
            password: hashedPassword,
            username: username
        });
        
        await newUser.save();

        const token = jwt.sign(
            { user_id: newUser._id, username: newUser.username },
            process.env.JWT_KEY || 'secret_key',
            { expiresIn: '1d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ message: "new user added" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}