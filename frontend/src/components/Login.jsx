import React, { useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await LoginUser(formData.email, formData.password);
  };

  const LoginUser = async (email, password) => {
    const body = JSON.stringify({
      email: email,
      password: password
    })


    try {
      const response = await fetch(`http://localhost:5000/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: body,
      });

      const data = await response.json();
      console.log(data)
      console.log(response)
      if (response.status === 200) {
        console.log("landing")
        localStorage.setItem("token", data.token);
        navigate('/landing')
        return data;
      } else {
        throw new Error("Wrong Email or Password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Book Share</h1>

        <p className="header-paragraph">
          Sign in to see book recommendations from your friends.
        </p>

        <form
          encType="multipart/form-data"
          className="register-form-container"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Sign In</button>
          <div className="text-with-lines login">
            <hr className="line" />
            <p className="text">OR</p>
            <hr className="line" />
          </div>
          <p>
            Don't have an account?<Link to={"/"}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
