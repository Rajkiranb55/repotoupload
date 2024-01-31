import React, { useEffect } from "react";
import "./comments.css";
import { useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useContext } from "react";
import { useParams } from "react-router-dom";
const initialCommentInfo = {
  name: "",
  postId: "",
  comments: "",
  data: new Date(),
};
const Comments = ({ post }) => {
  const [comment, setComment] = useState(initialCommentInfo);
  const [allCommnets, setAllComments] = useState([]);

  const d = new Date();
  const { userName } = useContext(UserContext);
  // console.log(post._id);

  useEffect(() => {
    const id = post._id;
    const getData = async () => {
      await fetch(`http://localhost:8000/allcomments/${id}`)
        .then((response) => response.json())
        .then((data) => setAllComments(data));
    };
    console.log(allCommnets);
    getData();
  }, []);
  ///change handeler
  const changeHandler = (e) => {
    setComment({
      ...comment,
      comments: e.target.value,
      name: userName,
      postId: post._id,
    });
    console.log(comment);
  };

  const addComment = async () => {
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:8000/addcomment", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data);
            setComment(initialCommentInfo);
          }
        });
    } else {
      console.log("kuch toh gadbad hai bhai");
    }
  };

  return (
    <div>
      <div className="comments_input_box">
        <textarea
          placeholder="write your mind here..."
          name="comments"
          value={comment.comments}
          onChange={changeHandler}
        ></textarea>
        <button onClick={(e) => addComment(e)}>post comment</button>
      </div>
      <div className="comments_display_section">display section</div>
    </div>
  );
};

export default Comments;
