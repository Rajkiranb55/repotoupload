import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContextProvider";
import { useContext } from "react";

const SIgnUp = ({ isUserAUthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const { setUserName } = useContext(UserContext);

  const handleSignup = async () => {
    console.log("signing in", formData);
    let responseData;
    axios
      .post("http://localhost:8000/signup", formData)
      .then(({ data }) => {
        console.log(data);
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };
  const changeHandeler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLogin = async () => {
    console.log("loggin in with ", formData);

    let responseData;
    await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      setUserName(responseData.userName);
      navigate("/home");
      isUserAUthenticated(true);
    } else {
      alert(responseData.errors);
    }
  };
  return (
    <div>
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={changeHandeler}
        />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={changeHandeler}
        />
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={changeHandeler}
        />
        <button
          onClick={() => {
            handleSignup();
          }}
        >
          signup
        </button>
      </div>
      <div>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={changeHandeler}
        />
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={changeHandeler}
        />
        <button
          onClick={() => {
            handleLogin();
          }}
        >
          signup
        </button>
      </div>
    </div>
  );
};

export default SIgnUp;
