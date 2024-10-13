import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "../css/login.css"; // Use the same CSS for consistency
import Logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email pattern validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setPasswordMismatch(false);

    // Check email validation
    if (!validateEmail(inputUsername)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Check password length
    if (inputPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (inputPassword !== confirmPassword) {
      setPasswordMismatch(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8020/api/v1/auth/register",
        {
          email: inputUsername,
          password: inputPassword,
          passwordConfirm: confirmPassword,
          role: "user", // Default role
        }
      );

      // If successful, save token in localStorage and redirect to /login
      if (response.data.status === "success") {
        localStorage.setItem("authToken", response.data.data.token);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during signup:", error);
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
        <div className="h4 mb-2 text-center">Sign Up</div>
        {/* Alert for Email Error */}
        {emailError && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setEmailError("")}
            dismissible
          >
            {emailError}
          </Alert>
        )}
        {/* Alert for Password Mismatch */}
        {passwordMismatch && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setPasswordMismatch(false)}
            dismissible
          >
            Passwords do not match.
          </Alert>
        )}
        {/* Alert for Password Error */}
        {passwordError && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setPasswordError("")}
            dismissible
          >
            {passwordError}
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
        <Form.Group className="mb-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check
            type="checkbox"
            label="I agree to the terms and conditions"
            required
          />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Sign Up
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Signing Up...
          </Button>
        )}
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Anshul Saraswat | &copy;2024
      </div>
    </div>
  );
};

export default Signup;
