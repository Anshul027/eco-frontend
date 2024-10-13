import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios"; // Import axios for making API requests
import "../css/login.css";
import Logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Login = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate email and password
    if (!inputUsername || !inputPassword) {
      setShow(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8020/api/v1/auth/login",
        {
          email: inputUsername,
          password: inputPassword,
        }
      );

      // If successful, save token in localStorage
      if (response.data.message === "Successful login") {
        localStorage.setItem("authToken", response.data.data.token);
        navigate("/home"); // Redirect to home or another page after login
      }
    } catch (error) {
      console.error("Error during login:", error);
      setShow(true); // Show alert for incorrect credentials
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in__wrapper">
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign In</div>
        {/* Alert */}
        {show && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect email or password.
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={inputUsername}
            placeholder="Email"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        <Button
          className="w-100"
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </Button>
        <div className="d-flex justify-content-between m-2">
          <div className="d-grid justify-content-end">
            <Link className="text-muted px-0" variant="link" to="/signup">
              Sign Up
            </Link>
          </div>
          <div className="d-grid justify-content-end">
            <Link className="text-muted px-0" variant="link" to={"/forget"}>
              Forgot password?
            </Link>
          </div>
        </div>
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-black text-center">
        Made by Anshul Saraswat | &copy;2024
      </div>
    </div>
  );
};

export default Login;
