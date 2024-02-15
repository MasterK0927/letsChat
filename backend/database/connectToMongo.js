import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToMongo=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to mongodb");
    }catch(error){
        console.log("error connecting to mongo",error.message);
    }
}

export default connectToMongo;