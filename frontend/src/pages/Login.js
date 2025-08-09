// Login Page

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./AuthForm.css"; // Assuming you have a CSS file for styling


const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
  e.preventDefault(); // stop page refresh

  try {
    const res = await fetch('http://localhost:5050/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Save token to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);

    alert("Login successful!");
    navigate("/listings");

  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong");
  }
};

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="auth-page">
            <div className="auth-form-wrapper">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required value={email}  onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required value={password} onChange={(e ) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
    );
};  

export default Login;