import React, { useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleProfilePic = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await registerUser(
      formData.name,
      formData.email,
      formData.password,
      formData.profilePicture,
    );
  };

  const registerUser = async (name, email, password, pic_url) => {
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("password", password);
    body.append("pic_url", pic_url);
    for (const pair of body.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const response = await fetch(`http://localhost:5000/api/users`, {
  method: "POST",
  headers:{
    // "Content-Type":"application/json"
  },
  body
});

      const data = await response.json();
      console.log(response)
      if (response.status === 201) {
        navigate("/login");
        return data;
      } else {
        throw new Error("Error Registeering");
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Book Share</h1>

        <p className="header-paragraph">
          Sign up to see book recommendations from your friends.
        </p>

        <form
          encType="multipart/form-data"
          className="register-form-container"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="profilePicture"
            onChange={handleProfilePic}
            
          />

          <div className="bottom-register">
            <p className="bottom-register-text">
              By signing up, you agree to our Terms, Privacy Policy and Cookies
              Policy.
            </p>

            <button type="submit">Sign Up</button>

            <div className="text-with-lines">
              <hr className="line" />
              <p className="text">OR</p>
              <hr className="line" />
            </div>
            <p>
              Already have an account?<Link to={"/login"}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
