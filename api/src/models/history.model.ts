import mongoose, { Schema, Types } from "mongoose";

export type HistoryIntrf = {
    created_at: string;
    explanation: string;
    image: {
        public_id: string;
        url: string;
        resource_type: string;
    };
    user_id: Types.ObjectId;
}

const historySchema = new Schema<HistoryIntrf>({
    created_at: { type: String, required: true },
    explanation: { type: String, required: true },
    image: {
        public_id: { type: String, required: true },
        resource_type: { type: String, required: true },
        url: { type: String, required: true }
    },
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const History = mongoose.model<HistoryIntrf>("histories", historySchema, "histories");