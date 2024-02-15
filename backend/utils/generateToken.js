import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res)=>{
    //we created the token by calling the sign method
    //we sent paylod to this method as well as the secret
    //also defined that it should get expired in 15days
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn:'15d'}
    )
    res.cookie("jwt", token,{
        maxAge: 15*24*60*60*1000, //in the milliseconds format
        httpOnly:true, //prevent xss attacks
        sameSite:"strict", //prevents csrf attacks, xss req forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};

export default generateTokenAndSetCookie;