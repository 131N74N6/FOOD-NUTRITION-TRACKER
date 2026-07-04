import { Router } from "express";
import { analyzingImages, deleteAllResults, deleteResult } from "../controllers/result.controller";
import { getAllResults, getDetailedResult } from "../views/result.view";
import { verifyToken } from "../middleware/auth.middleware";

const resultRouters = Router();

resultRouters.delete('/rm-all', verifyToken, deleteAllResults);
resultRouters.delete('/rm/:_id', verifyToken, deleteResult);

resultRouters.get('/show-all', verifyToken, getAllResults);
resultRouters.get('/show/:_id', verifyToken, getDetailedResult);

resultRouters.post('/analyze', verifyToken, analyzingImages);

export default resultRouters;