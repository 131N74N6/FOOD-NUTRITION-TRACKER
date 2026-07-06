import dns from 'node:dns/promises';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log("dns server: 1.1.1.1 or 8.8.8.8");
}

import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import authRouters from './routers/auth.router';
import resultRouters from './routers/result.router';
import userRouters from './routers/user.router';
import { db } from './services/mongodb.service';
import { v2 } from "cloudinary";

const app = express();

v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:2100', 'http://localhost:5173']
}));
app.use('/api/auths', authRouters);
app.use('/api/results', resultRouters);
app.use('/api/users', userRouters);

if (process.env.NODE_ENV !== 'production') {
    db.then(() => {
        app.listen(2100, () => console.log(`api running at: http://localhost:2100`));
    });
}

export default app;