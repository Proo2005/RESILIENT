
import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import "../styles/auth.css";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);


  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    agree: false,
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
      alert("Login Successful!");
      console.log("Login Response:", res.data);
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupData.agree) {
      alert("You must agree to the terms!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", signupData);
      alert("Signup Successful! Please login.");
      setIsLogin(true);
      console.log("Signup Response:", res.data);
    } catch (err) {
      console.error("Signup Failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <GlassCard>
        {isLogin ? (
          <>
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <button type="submit">Login</button>
            </form>
            <p className="toggle-text">
              Don't have an account?{" "}
              <span onClick={() => setIsLogin(false)}>Sign up</span>
            </p>
          </>
        ) : (
          <>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={signupData.firstname}
                onChange={handleSignupChange}
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={signupData.lastname}
                onChange={handleSignupChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="agree"
                  checked={signupData.agree}
                  onChange={handleSignupChange}
                />
                <label>I agree to the terms & conditions</label>
              </div>
              <button type="submit">Sign Up</button>
            </form>
            <p className="toggle-text">
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default AuthPage;
