//Register Page

import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./AuthForm.css"; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault(); // stop page refresh

        try {
            const res = await fetch('http://localhost:5050/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            
            const data = await res.json();


            if (!res.ok) {
                alert(data.message || "Registration failed");
                return;
            }
            let loginRes = await fetch('http://localhost:5050/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
                });
                let loginData = await loginRes.json();
                if (loginRes.ok) {
                localStorage.setItem('token', loginData.token);
                const userId = loginData.userId || loginData.user?.id || loginData.user?._id || '';
                if (userId) localStorage.setItem('userId', userId);
                navigate('/listings');
                }

            alert("Registration successful! ");
        } catch (err) {
            console.error("Registration error:", err);
            alert("Something went wrong");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-wrapper">
            <form className=   " auth-form"onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Register</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    </div>
    );
}

export default Register;