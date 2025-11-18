import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "./Login.css"; 

function Signup() {
const { signup, actionLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const success = await signup({ name, email, password });
    if (success) navigate("/"); 
    else setError("Signup failed. Try again.");
  };

  return (
    <div className="login-container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignup} className="login-form">
        {error && <div className="error">{error}</div>}

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

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

        <button type="submit" className="login-button" disabled={actionLoading}>
            {actionLoading ? "Signing up..." : "Sign Up"}
        </button>

      </form>

      <p className="signup-text">
        Already have an account? <a href="/login">Login here</a>.
      </p>
    </div>
  );
}

export default Signup;
