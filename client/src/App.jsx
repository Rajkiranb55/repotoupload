import React from "react";
import { useState } from "react";
import axios from "axios";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./comp/HomePage";
import SIgnUp from "./comp/SIgnUp";
import CreateBlogPage from "./comp/createblog/CreateBlogPage";
import BlogView from "./comp/blogview/BlogView";
import Update from "./comp/update/Update";

const PrivateRoute = ({ isAuthenticated, ...props }) => {
  return isAuthenticated ? (
    <>
      <Outlet />{" "}
    </>
  ) : (
    <Navigate replace to="/" />
  );
};

const App = () => {
  const [isAuthenticated, isUserAUthenticated] = useState(false);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<SIgnUp isUserAUthenticated={isUserAUthenticated} />}
        />
        <Route
          path="/"
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
        >
          <Route
            path="/home"
            element={<HomePage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/createblog" element={<CreateBlogPage />} />
          <Route path="/viewblog/:id" element={<BlogView />} />
          <Route path="/update/:id" element={<Update />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
