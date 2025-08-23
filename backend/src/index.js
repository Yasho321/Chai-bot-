import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import mongoose from "mongoose";
// import authRoutes from './routes/user.routes.js'
// import sourceRouter from "./routes/source.routes.js"
// import chatRouter from "./routes/chat.routes.js"

dotenv.config()



const app = express();

const port= process.env.PORT || 8080;


app.use(cors({
    origin: ['http://localhost:5173','https://notebook-lm-clone-one.vercel.app'] ,
    credentials: true,               
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
       allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
}));



app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api/v1/auth",authRoutes );
// app.use("/api/v1/source", sourceRouter);
// app.use("/api/v1/chat",chatRouter)




const db = () =>{
    
    
    
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to MongoDB");
        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`)
        })

    }).catch((error)=>{
        console.log("Error connecting to MongoDB",error);
    })
}
db();



app.get("/api/v1/healthcheck",(req,res)=>{
    res.send("Server is running")
})