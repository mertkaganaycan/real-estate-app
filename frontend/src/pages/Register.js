//Register Page

import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./AuthForm.css"; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';

const Register = () => {        
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); // stop page refresh

        try {
            const res = await fetch('http://localhost:5050/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful! You can now log in.");
        } catch (err) {
            console.error("Registration error:", err);
            alert("Something went wrong");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-wrapper">
            <form className=   " auth-form"onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link>.</p>
        </div>
    </div>
    );
}

export default Register;