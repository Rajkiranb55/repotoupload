import React, { useEffect } from "react";
import { useState } from "react";
import Card from "../card/Card";
import "./posts.css";
import { UserContext } from "../../context/UserContextProvider";
import { useContext } from "react";
import { Link } from "react-router-dom";
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [render, setRender] = useState([]);
  const { filter } = useContext(UserContext);
  useEffect(() => {
    const fetchData = () => {
      fetch("https://repotoupload.vercel.app/allposts")
        .then((response) => response.json())
        .then((data) => setPosts(data));
    };
    const filterPosts = () => {
      let filteredPosts;
      if (filter === "all") {
        setRender(posts);
        console.log("yup it is");
      } else {
        filteredPosts = posts.filter((post) => post.category === filter);
        setRender(filteredPosts);
      }
      console.log(render);
    };

    fetchData();
    filterPosts();
  }, [filter]);

  return (
    <div>
      <h1>Posts</h1>
      <div className="post_container">
        {render.length > 0
          ? render.map((item, i) => {
              // console.log(item);
              return (
                <Link to={`/viewblog/${item._id}`} key={i}>
                  <Card key={i} data={item} />
                </Link>
              );
            })
          : posts.map((item, i) => {
              // console.log(item);
              return (
                <Link to={`/viewblog/${item._id}`} key={i}>
                  <Card key={i} data={item} />
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default Posts;
