import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

//signup logic
export const signup = async(req,res)=>{
    try{
        const {fullName, username, password, confirmPassword,gender}=res.body;

        if(password != confirmPassword){
            return res.status(400).json({
                error:"Passwords don't match"
            })
        }
        const user=await User.findOne({username});
        if(user){
            return res.status(400).json({error:"username already exists"})
        }

        //hashing the password so even if database is stolen user password remains the same
        const salt=await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //profile picture from the api
        const boyProfilePic= `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic= `https://avatar.iran.liara.run/public/girl?username=${username}`

        //loading schema from models into a newUser object
        const newUser = new User({
            fullName,
            username,
            hashPassword,
            gender,
            profilePic: gender==="male"? boyProfilePic : girlProfilePic
        })
        if(newUser){
            //generate jwt tokens
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save(); //saving it

        //making the succesful connection into json file for storing _id and other details.
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        }
        else{
            res.status(400).json({error:"invalid user data"});
        }
    }catch(error){
        res.status(500).json({
            error:"internal server error"
        })
    }
};

//login logic
export const login =async(req,res)=>{
    try{
        const {username, password}=res.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); //if the user doesnt exists then the password will get compared with the empty string and error can be prevented

        if(user || !isPasswordCorrect){
            return res.status(400).json({error:"invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
    }catch{
        res.status(500).json({
            error:"internal server error"
        })
    }
}

//logout logic
export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logged out successfully"});
    }
    catch{
        console.log("error in logout controller",error.message);
        res.status(500).json({
            error:"internal server error"
        });
    }
}
