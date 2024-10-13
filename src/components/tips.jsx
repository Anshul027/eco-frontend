import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav } from "./nav"; // Assuming Nav is the same as we defined earlier

export const Tips = () => {
  const [tips, setTips] = useState([]); // For storing fetched tips
  const [newTip, setNewTip] = useState(""); // For inputting new tip
  const [error, setError] = useState(null); // For error messages

  // Fetch the tips from the API
  useEffect(() => {
    const fetchTips = async () => {
      const token = localStorage.getItem("authToken"); // Get token from localStorage

      try {
        const response = await axios.get(
          "http://localhost:8020/api/v1/eco-friendly-practices",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include Bearer token
            },
          }
        );
        setTips(response.data); // Set the fetched tips
      } catch (error) {
        console.error("Error fetching tips:", error);
      }
    };

    fetchTips();
  }, []);

  // Function to handle adding a new tip
  const handleAddTip = async () => {
    const token = localStorage.getItem("authToken"); // Get token from localStorage
    const tipRegex = /^[A-Z][a-zA-Z0-9\s,.'"-]{20,300}[.!?]$/; // Define regex

    if (!newTip.trim()) {
      setError("Tip cannot be empty!"); // Display error if tip is empty
      return;
    }

    if (!tipRegex.test(newTip.trim())) {
      setError(
        "Invalid tip format. Please provide a meaningful tip in paragraph format, at least 20 characters long, starting with a capital letter and ending with proper punctuation."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8020/api/v1/eco-friendly-practices",
        { message: newTip },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token
          },
        }
      );

      // Add the new tip to the existing list of tips
      setTips([...tips, response.data]);

      // Clear the input field after successful submission
      setNewTip("");
      setError(null); // Reset error state
    } catch (error) {
      console.error("Error adding tip:", error);
      setError("Failed to add tip, please try again.");
    }
  };

  return (
    <>
      <Nav /> {/* Include Nav */}
      <div className="container">
        <h2 className="text-center my-4">Eco-Friendly Tips</h2>

        <div className="mb-3">
          <label htmlFor="newTip" className="form-label">
            Add a new tip:
          </label>
          <textarea
            id="newTip"
            className="form-control"
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            rows="3"
          ></textarea>
          {error && <small className="text-danger">{error}</small>}
          <button className="btn btn-primary mt-2" onClick={handleAddTip}>
            Submit Tip
          </button>
        </div>

        <div className="row">
          {tips.map((tip, index) => (
            <div key={index} className="col-md-4">
              <div
                className="card shadow-lg mb-4"
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                <div
                  className="card-header bg-success text-white"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  Tip {index + 1}
                </div>
                <div className="card-body" style={{ textAlign: "left" }}>
                  <p
                    className="card-text"
                    style={{
                      fontSize: "1.1rem",
                      color: "#333",
                      lineHeight: "1.5",
                    }}
                  >
                    {tip.message}
                  </p>
                  <small className="text-muted">
                    Created at: {new Date(tip.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
