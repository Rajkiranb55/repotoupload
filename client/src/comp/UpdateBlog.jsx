import React from "react";

const UpdateBlog = () => {
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
          <button onClick={() => savePost()}>Post Blog</button>
        </div>
      </div>
      <div className="blog_text_area">
        <textarea
          name="description"
          placeholder="write your mind here..."
          onChange={(e) => changeHandler(e)}
        ></textarea>
      </div>
    </div>
  );
};

export default UpdateBlog;
