import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import Categories from "./categories/Categories";
import Posts from "./Posts/Posts";
const HomePage = ({ isAuthenticated }) => {
  const { userName } = useContext(UserContext);
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();

  return (
    <div>
      <h1>HOme</h1>
      <p>Hi {userName}</p>
      <button onClick={() => navigate("/")}>Logout</button>

      <Categories isAuthenticated={isAuthenticated} />
      <Posts />
    </div>
  );
};

export default HomePage;
