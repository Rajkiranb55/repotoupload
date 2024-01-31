import React from "react";
import "./update.css";
import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import imgwall from "../../assets/createblogtemp.jpg";
import wallpaper from "../../assets/wall4.jpg";
import { useEffect } from "react";
import { categories } from "../../data/Categories";
import { UserContext } from "../../context/UserContextProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
const baseBlogPost = {
  title: "",
  description: "",
  picture: "",
  username: "",
  category: "",
  createdDate: "",
};
const Update = () => {
  const [post, setPost] = useState(baseBlogPost);
  const [image, setImage] = useState(false);
  const { userName } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://localhost:8000/blogdata/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data));
    };
    fetchData();
  }, []);
  useEffect(() => {
    const getImage = async () => {
      let ressponseData;
      let newPost = post;
      let formData = new FormData();
      formData.append("newPost", image);
      if (image) {
        //API CALL TO UPLOAD IMAGE
        await fetch("http://localhost:8000/upload", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        })
          .then((resp) => resp.json())
          .then((data) => (ressponseData = data));

        if (ressponseData.success) {
          console.log(ressponseData.image_url);
          post.picture = ressponseData.image_url;
          console.log(post);
        }
      }
    };
    getImage();
    post.username = userName;
    post.createdDate = Date.now();
  }, [image]);

  const changeHandler = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
    // console.log(post);
  };
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };
  const updatePost = () => {
    if (localStorage.getItem("auth-token")) {
      fetch(`http://localhost:8000/updatepost2/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: post,
        }),
      })
        .then((response) => response.json())
        .then((data) => setPost(data));
      navigate(`/viewblog/${id}`);
    } else {
      console.log("kuch toh gadbad hai bhai");
    }
  };

  return (
    <div className="blog_post_form">
      <h1>Creating Blog here</h1>
      <div className="wallpaper_container">
        <img src={image ? post.picture : wallpaper} alt="" />
      </div>
      <div className="blog_info_section">
        <div className="upload_btn_sec">
          <label>
            <FaFileUpload className="upload_icon" />
          </label>
          <input
            type="file"
            className="upluad_blog_img_thumb"
            // style={{ display: "none" }}
            onChange={imageHandler}
          ></input>
        </div>
        <div className="blog_heading_input">
          <label>Title of the Blog</label>
          <input
            type="text"
            name="title"
            id=""
            onChange={(e) => changeHandler(e)}
            value={post.title}
          />
        </div>
        <div className="category_dropdown">
          <select
            onChange={changeHandler}
            name="category"
            value={post.category}
          >
            {categories.map((item) => {
              return (
                <option value={item.category} key={item.id}>
                  {item.category}
                </option>
              );
            })}
          </select>
        </div>
        <div className="">
          <button onClick={() => updatePost()}>Update Blog</button>
        </div>
      </div>
      <div className="blog_text_area">
        <textarea
          name="description"
          placeholder="write your mind here..."
          onChange={(e) => changeHandler(e)}
          value={post.description}
        ></textarea>
      </div>
    </div>
  );
};

export default Update;
