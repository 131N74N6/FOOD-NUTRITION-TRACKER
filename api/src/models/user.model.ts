import mongoose, { Schema } from "mongoose";

export type UserIntrf = {
    created_at: string;
    email: string;
    password: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    };
    username: string;
}

const userSchema = new Schema<UserIntrf>({
    created_at: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile_picture: {
        public_id: { type: String },
        resource_type: { type: String },
        url: { type: String }
    },
    username: { type: String, required: true },
});

export const User = mongoose.model<UserIntrf>("users", userSchema, "users");