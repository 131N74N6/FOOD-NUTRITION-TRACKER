import { Request, Response } from "express";
import { AuthUser } from "../middleware/auth.middleware";
import { Results } from "../models/result.model";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { analyzeImageWithAI } from "../services/ai.service";

export async function analyzingImages(req: AuthUser, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        
        const image = req.file as Express.Multer.File | undefined;
        if (!image) return res.status(400).json({ message: "image is required" });
        
        const aiResult = await analyzeImageWithAI(image.buffer, image.mimetype);

        const uploadResult = await uploadToCloudinary({ 
            fileBuffer: image.buffer, 
            folder: "nutrition_tracker", 
            originalName: image.originalname 
        });

        const newResult = new Results({
            created_at: new Date().toISOString(),
            explanation: aiResult.analysis,
            image: uploadResult,
            user_id: currentUserId!
        });

        await newResult.save();
        res.status(200).json({ explanation: aiResult.analysis });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "something went wrong" });
    }
}

export async function deleteAllResults(req: AuthUser, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const results = await Results.find({ user_id: currentUserId });
        if (results.length === 0) return res.status(400).json({ message: "data not found" });

        const deletePromises = results.map(result => {
            return v2.uploader.destroy(result.image.public_id, { resource_type: result.image.resource_type })
        });

        await Promise.all ([
            ...deletePromises,
            Results.deleteMany({ user_id: currentUserId })
        ]);
        res.status(200).json({ message: "all results deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteResult(req: Request, res: Response) {
    try {
        const result = await Results.findOne({ _id: req.params._id });
        if (!result) return res.status(404).json({ message: "data not found" });

        await v2.uploader.destroy(result.image.public_id, { resource_type: result.image.resource_type });
        await Results.deleteOne({ _id: req.params._id });
        res.status(200).json({ message: "result deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}