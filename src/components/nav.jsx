import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Logo from "../assets/images/logo.png";
import "../css/nav.css"; // Import the CSS file for styling

export const Nav = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear the auth token from localStorage
    navigate("/"); // Redirect to the home page or login page
  };

  return (
    <nav className="navbar navbar-light bg-success rounded-bottom-1">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo on the left */}
        <Link className="navbar-brand" to={"/home"}>
          <img
            src={Logo}
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block align-text-top"
          />
        </Link>

        {/* Centered Links */}
        <div className="mx-auto d-flex">
          <Link
            to="/home"
            className="nav-link text-white me-3 fw-semibold fs-5 underline-link"
          >
            Home
          </Link>
          <Link
            to="/tips"
            className="nav-link text-white fw-semibold fs-5 underline-link"
          >
            Tips
          </Link>
        </div>

        {/* Logout Button on the right */}
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};
