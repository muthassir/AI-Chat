import Post from '../models/Post.js'
import * as dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"

dotenv.config()

cloudinary.config({
    cloud_name : process.env.cloudName,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
})

export const getAllPosts = async (req, res)=>{
    try {
        const posts = await Post.find({})
        return res.status(200).json({success:true, data: posts})
    } catch (error) {
        console.log("error get all post", error);
        
    }
}


export const createPosts = async (req, res)=>{
    try {
        const {name, prompt, photo} = req.body
        const photoUrl = await cloudinary.uploader.upload(photo)
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl?.secure_url,
        })

        return res.status(200).json({success:true, data: newPost})
    } catch (error) {
        console.log("error creating post", error);
        
    }
}