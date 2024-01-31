import React from "react";
import "./card.css";
import img1 from "../../assets/cardimg1.jpg";
import img2 from "../../assets/authorimg1.png";

const Card = ({ data }) => {
  return (
    <div className="card">
      <div className="image_container">
        <img src={data.picture} alt="" />
      </div>
      <div className="category_area">
        <p>{data.category}</p>
      </div>
      <div className="author_area">
        <img src={img2} alt="" />
        <p>{data.username}</p>
      </div>
      <div className="date_container">
        <p>{data.createdDate}</p>
      </div>
      <div className="title_container">
        <p>{data.title}</p>
      </div>
      <div className="initial_data">
        <p>{data.description}</p>
      </div>
    </div>
  );
};

export default Card;
