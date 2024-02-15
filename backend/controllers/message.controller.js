import Conversation from "../models/communication.model.js";
import Message from "../models/message.model.js";

export const sendMessage=async (req,res)=>{
    try{
        const {message}=req.body;
        const {id,receiverId}=req.params;
        const senderId=req.user._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId,receiverId]},
        })

        if(!conversation){
            conversation= await Conversation.create({
                participants:[senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        //this will run in parallel, both will be loaded at same time
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
    }catch{
        console.log("error in messsage controller",error.message);
        res.status(500).json({
            error:"internal server error"
        });
    }
} 

export const getMessage= async (req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const senderId = req.user._id;

        const conversation =  await conversation.findOne({
            participate: {$all: [senderId,userToChatId]},
        }).populate("messages");

        if(!conversation){
            return res.status(200).json([]);
        }

        const messages = conversation.messages;

        res.status(200).json(conversation.messages);
    }catch{

    }
}