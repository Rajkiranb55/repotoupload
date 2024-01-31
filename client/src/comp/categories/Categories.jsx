import React from "react";
import "./categories.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { categories } from "../../data/Categories";
import { UserContext } from "../../context/UserContextProvider";
import { useContext } from "react";
const Categories = ({ isAuthenticated }) => {
  const [category, setCategory] = useState("all");
  const { filter, setFilter } = useContext(UserContext);
  let option = "all";

  const changeFilter = (e) => {
    // console.log(e.target.getAttribute("name"));
    option = e.target.getAttribute("name");
    setFilter(option);
  };
  return (
    <div className="categories_container">
      {categories.map((item) => {
        return (
          <div key={item.id} name={item.category}>
            <p onClick={(e) => changeFilter(e)} name={item.category}>
              {item.category}
            </p>
          </div>
        );
      })}

      {isAuthenticated ? (
        <Link className="create_blog_btn" to="/createblog">
          Create Blog
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};

export default Categories;
