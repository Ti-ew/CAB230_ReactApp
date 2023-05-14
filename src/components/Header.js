// Header.js

import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Header.css"
function Header() {
  const { isLoggedIn } = React.useContext(AuthContext);
  
  return (
    <nav className ="nav-container">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/movies">Movies</Link>
      {isLoggedIn ? (
        <Link className="nav-link" to="/logout">Logout</Link>
      ) : (
        <>
          <Link className="nav-link" to="/register">Register</Link>
          <Link className="nav-link" to="/login">Login</Link>
        </>
      )}
    </nav>
  );
}

export default Header;
