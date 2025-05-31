import React, { useEffect } from "react";
import Searchbar from "../components/Searchbar";
import sampleImg from "../assets/batman-1920x1080.jpg";
import fileSaver from "file-saver";
import { useState } from "react";
import { GetPosts } from "../API";

const Home = () => {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredpost, setFilteredPost] = useState("");

  const getPost = async () => {
    await GetPosts().then((res) => {
      setPost(res?.data?.data);
      setFilteredPost(res?.data?.data);
    });
  };

  useEffect(() => {
    getPost();
  }, []);
  useEffect(() => {
    const filteredpost = post.filter((post) => {
      const promptMatch = post?.prompt
        .toLowerCase()
        .includes(search.toString().toLowerCase());
      return promptMatch;
    });
    if (!search) {
      filteredpost;
    }
  }, [post, search]);

  return (
    <div className=" justify-center flex-col flex">
      <Searchbar search={search} setSearch={setSearch} />
      <div className="home px-36 py-26 gap-4">
        {filteredpost.length === 0 ? (
          <>No Posts</>
        ) : (
          <>
            {filteredpost
              .slice()
              .reverse()
              .map((item, index) => {
                <div className="img-card" key={index}>
                  <img
                    src={item.photo}
                    alt="prompt image"
                    className="rounded"
                  />
                  <div className="det w-full absolute top-64 flex gap-3">
                    <p>{item.author}</p>
                    <p>{item.prompt}</p>
                  </div>
                  <button
                    onClick={() => fileSaver.saveAs(sampleImg, "donwload.jpg")}
                    className="det absolute top-64 left-2/6"
                  >
                    ↓
                  </button>
                </div>;
              })}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
