import { Request, Response } from "express";
import { AuthUser } from "../middleware/auth.middleware";
import { Results } from "../models/result.model";

export async function getAllResults(req: AuthUser, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const results = await Results
        .find({ user_id: currentUserId })
        .limit(limit)
        .skip(skip);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function getDetailedResult(req: Request, res: Response) {
    try {
        const results = await Results.find({ _id: req.params._id });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}