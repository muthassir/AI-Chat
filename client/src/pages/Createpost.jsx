import React from "react";
import { CreatePost, GenerateAiImage } from "../API/index";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Createpost = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateImg = async () => {
    setLoading(false);
    await GenerateAiImage({ prompt: post.prompt })
      .then((res) => {
        setPost({
          ...post,
          photo: `data:image/jpeg;base64,${res?.data?.photo}`,
        });
        
        setLoading(true);
      })
      .catch((error) => {
        console.log(error, "prompt mv error");
      });
  };
  const postImge = async () => {
    setLoading(false);
    await CreatePost(post)
      .then((res) => {
        console.log(res);
        
        setLoading(true);
        navigate("/");
      })
      .catch((error) => {
        console.log(error, "error creating post mv");
      });
  };

  return (
    <div>
      <h1 className="text-3xl p-4 text-center">Generate Image with prompt</h1>
      <p className="text-center">
        Write your prompt according to the image you want to generate
      </p>
      <div className="flex justify-evenly items-center px-6 mt-24 lg:flex-row flex-col lg:gap-0 gap-8">
        <div className="flex flex-col gap-4 ">
          <label>author</label>
          <input
            type="text"
            className="input bg-neutral"
            placeholder="Enter your name..."
            value={post.name}
            onChange={(e) => setPost({ ...post, name: e.target.value })}
          />
          <label>Prompt</label>
          <textarea
            name=""
            id=""
            className="textarea bg-neutral"
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
          ></textarea>
          <div className="flex gap-6">
            <button onClick={generateImg} className="btn btn-primary">
              Generate Image
            </button>
            <button onClick={postImge} className="btn btn-error">
              Post Image
            </button>
          </div>
        </div>
        <div>
          <img
            src={null}
            alt="img"
            className="border-violet-600 border-2 border-dotted h-40 w-40 rounded m-6"
          />
        </div>
      </div>
    </div>
  );
};

export default Createpost;
