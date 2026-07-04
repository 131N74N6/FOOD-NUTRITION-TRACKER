import mongoose, { Schema, Types } from "mongoose";

export type ResultIntrf = {
    created_at: string;
    explanation: string;
    image: {
        public_id: string;
        resource_type: string;
        url: string;
    };
    user_id: Types.ObjectId;
}

const resultSchema = new Schema<ResultIntrf>({
    created_at: { type: String, required: true },
    explanation: { type: String, required: true },
    image: {
        public_id: { type: String, required: true },
        resource_type: { type: String, required: true },
        url: { type: String, required: true }
    },
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const Results = mongoose.model<ResultIntrf>("results", resultSchema, "results");