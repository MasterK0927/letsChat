import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectToMongo from "./database/connectToMongo.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

const app=express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cookieParser());
app.use(express.json()); //to parse the incoming requests with json payloads from re.body


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("api/users", userRoutes);

app.listen(PORT, ()=> {
    connectToMongo();
    console.log("connected to server at 8000");
});