// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "./Login.css";

function Login () {
  const { login, user, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) navigate("/");
    else setError("Invalid credentials.");
  };
  
  // GitHub OAuth login
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/github";
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {/* Email/Password Form */}
      <form onSubmit={handleLogin} className="login-form">
        {error && <div className="error">{error}</div>}

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <div className="oauth-divider">or</div>

      {/* GitHub OAuth */}
      <button onClick={handleGitHubLogin} className="github-button">
        Login with GitHub
      </button>

      <p className="signup-text">
        Don’t have an account? <a href="/signup">Sign up here</a>.
      </p>
    </div>
  );
}

export default Login;
