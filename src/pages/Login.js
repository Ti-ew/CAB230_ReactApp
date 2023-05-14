import React, { useState, useContext} from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Reuse the CSS styles from the Register component

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://sefdb02.qut.edu.au:3000/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { bearerToken, refreshToken } = data;
        login(bearerToken, refreshToken);

        alert("Login successful.");
        // Send the user to the home page
        navigate("/");
      } else {
        alert("User does not exist or incorrect password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error during login.");
    }
  };


  return (
    <div className="register-container"> {/* Reuse the register-container class */}

      <form onSubmit={handleSubmit} className="register-form"> {/* Reuse the register-form class */}
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
