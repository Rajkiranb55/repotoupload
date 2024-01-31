import React, { useEffect, useState } from "react";
import imgWall from "../../assets/wallpaper.jpg";
import "./blogview.css";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Comments from "./Comments";
const BlogView = () => {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { userName } = useContext(UserContext);
  // console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://localhost:8000/blogdata/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data));
    };
    fetchData();
  }, []);
  const deleteBlog = async () => {
    if (localStorage.getItem("auth-token")) {
      let resp = await fetch(`http://localhost:8000/deletepost2/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: post,
        }),
      });

      console.log(resp);
    } else {
      console.log("kuch toh gadbad hai bhai");
    }
    navigate("/home");
  };
  return (
    <div>
      <h1>BLog VIew</h1>
      <img src={imgWall} alt="" />
      <img src={post.picture} alt="" />
      <br />
      {userName === post.username ? (
        <div>
          <MdDelete className="icons" onClick={() => deleteBlog()} />
          <Link to={`/update/${post._id}`}>
            <FaEdit className="icons" />
          </Link>
        </div>
      ) : (
        ""
      )}

      <p>{post.username}</p>
      <p>{post.title}</p>
      <p>{post.createdDate}</p>
      <p>{post.description}</p>
      <Comments post={post} />
    </div>
  );
};

export default BlogView;
