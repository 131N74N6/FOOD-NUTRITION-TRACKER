import mongoose, { Schema } from "mongoose";

export type UserIntrf = {
    created_at: string;
    email: string;
    password: string;
    username: string;
    profile_picture: string;
}

const userSchema = new Schema<UserIntrf>({
    created_at: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    profile_picture: { type: String }
});

export const User = mongoose.model<UserIntrf>("users", userSchema, "users");