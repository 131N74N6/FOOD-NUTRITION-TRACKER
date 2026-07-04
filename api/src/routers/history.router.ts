import { Router } from "express";
import { analyzingImages, deleteAllResults, deleteResult, getAllResults, getDetailedResult } from "../controllers/history.controller";
import { verifyToken } from "../middleware/auth.middleware";

const historyRouters = Router();

historyRouters.delete('/rm-all', verifyToken, deleteAllResults);
historyRouters.delete('/rm/:_id', verifyToken, deleteResult);

historyRouters.get('/show-all', verifyToken, getAllResults);
historyRouters.get('/show/:_id', verifyToken, getDetailedResult);

historyRouters.post('/analyze', verifyToken, analyzingImages);

export default historyRouters;