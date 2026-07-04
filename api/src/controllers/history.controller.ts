import { Request, Response } from "express";
import { AuthUser } from "../middleware/auth.middleware";
import { History } from "../models/history.model";
import { v2 } from "cloudinary";

export async function analyzingImages(req: AuthUser, res: Response) {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllResults(req: AuthUser, res: Response) {
    try {
        const histories = await History.find({ user_id: req.user?.user_id });
        if (histories.length === 0) return res.status(400).json({ message: "data not found" });

        const deletePromises = histories.map(history => {
            v2.uploader.destroy(history.image.public_id, { resource_type: history.image.resource_type })
        });

        await Promise.all ([
            ...deletePromises,
            History.deleteMany({ user_id: req.user?.user_id })
        ]);
        res.status(200).json({ message: "all results deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteResult(req: Request, res: Response) {
    try {
        const history = await History.findOne({ _id: req.params._id });
        if (!history) return res.status(404).json({ message: "data not found" });

        await v2.uploader.destroy(history.image.public_id, { resource_type: history?.image.resource_type });
        await History.deleteOne({ _id: req.params._id });
        res.status(200).json({ message: "result deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function getAllResults(req: AuthUser, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const results = await History
        .find({ user_id: req.user?.user_id })
        .limit(limit)
        .skip(skip);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function getDetailedResult(req: Request, res: Response) {
    try {
        const results = await History.find({ _id: req.params._id });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}