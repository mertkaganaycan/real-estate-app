import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function tryLogin(body) {
    const res = await fetch("http://localhost:5050/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { res, data };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      alert("Please fill the field and password.");
      return;
    }

    // 1) try as email
    let { res, data } = await tryLogin({ email: identifier.trim(), password });

    // 2) if failed, try as username
    if (!res.ok) {
      const second = await tryLogin({ username: identifier.trim(), password });
      res = second.res;
      data = second.data;
    }

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    const userId = data.userId || data.user?.id || data.user?._id || "";
    if (userId) localStorage.setItem("userId", userId);

    navigate("/listings");
  }

  return (
    <div className="auth-page">
      <div className="auth-form-wrapper">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier">Email or Username:</label>
            <input
              type="text"                 // ← not "email"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="mail or username"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>

        <p>
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}