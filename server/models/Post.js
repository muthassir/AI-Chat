import mongoose  from "mongoose";

const PostSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    prompt:{
        type: String,
        required: true,
    },
    photo:{
        type: String,
        required: true,
    },
})

const Posts = mongoose.model("PostSchema", PostSchema)

export default Posts