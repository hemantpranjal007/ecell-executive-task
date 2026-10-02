import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Temporary authentication
    // We will connect proper authentication next.
    onLogin({
      email: email,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">E-Cell</div>

        <h1>Welcome back.</h1>

        <p className="auth-subtitle">
          Login to continue to E-Cell.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Login →
          </button>

        </form>

        <p className="switch-auth">
          Don't have an account?
          <button onClick={onSignup}>
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;