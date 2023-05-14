import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Movie from "./pages/Movie";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import Person from "./pages/Person"; // Add this new import
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

function LogoutHandler() {
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();


  React.useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return <></>;
}

function InnerApp() {


  return (
    <Router>
      <div className="App">
        <Header />
        <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:imdbID" element={<Movie />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<LogoutHandler />} />{" "}
          {/* Add this new route */}
          <Route path="/people/:id" element={<Person />} />
          {/* Add this new route */}
        </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
