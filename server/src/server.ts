import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import userRoutes from "./routes/user/userRoutes";
import { connectDb } from './config/db';
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin/adminRoutes"

dotenv.config();
connectDb()
const app=express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173", "http://43.204.136.174:5173"],
        credentials: true,
    })
);

app.use("/api/user", userRoutes);
app.use("/api/admin",adminRoutes );
const PORT = process.env.PORTNUMBER ||3000;
app.listen(PORT,()=>{
console.log(`Server is running on ${PORT}`)
})