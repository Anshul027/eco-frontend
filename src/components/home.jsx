import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { Nav } from "./nav";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  // State to store input values and validation errors
  const [transportationEmission, setTransportationEmission] = useState(""); // Changed to empty string
  const [energyConsumption, setEnergyConsumption] = useState(""); // Changed to empty string
  const [wasteDisposal, setWasteDisposal] = useState(""); // Changed to empty string
  const [errorMessage, setErrorMessage] = useState("");
  const [chartData, setChartData] = useState({}); // State for pie chart data
  const [totalFootprint, setTotalFootprint] = useState(0); // State for total footprint

  // Load carbon footprint data from local storage on component mount
  useEffect(() => {
    const storedFootprint = JSON.parse(localStorage.getItem("carbonFootprint"));
    if (storedFootprint) {
      setChartData(storedFootprint); // Set the chart data from local storage
      setTotalFootprint(storedFootprint.total); // Set the total from local storage
    }
  }, []);

  // Validation function to prevent negative input
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value < 0) {
      setErrorMessage("Values cannot be negative.");
    } else {
      setErrorMessage(""); // Clear the error
      setter(value);
    }
  };

  // Pie chart data
  const data = {
    labels: ["Transportation Emission", "Energy Consumption", "Waste Disposal"],
    datasets: [
      {
        data: [
          chartData.transportationEmission || 0,
          chartData.energyConsumption || 0,
          chartData.wasteDisposal || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Inline CSS for background and container styling
  const containerStyle = {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundImage: "url(https://example.com/eco-background.jpg)", // Replace with actual image URL
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
  };

  const totalDisplayStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    background: "#f0f0f0",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const token = localStorage.getItem("authToken"); // Get token from localStorage
    const emissionsData = {
      transportationEmission: Number(transportationEmission),
      energyConsumption: Number(energyConsumption),
      wasteDisposal: Number(wasteDisposal),
    };

    try {
      const response = await axios.post(
        "http://localhost:8020/api/v1/carbon-footprint",
        emissionsData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token
          },
        }
      );

      const { carbonFootprint } = response.data;

      // Save the response in local storage
      localStorage.setItem("carbonFootprint", JSON.stringify(carbonFootprint));

      // Update chart data and total footprint
      setChartData(carbonFootprint);
      setTotalFootprint(carbonFootprint.total);
    } catch (error) {
      console.error("Error tracking carbon footprint:", error);
      setErrorMessage("Failed to track carbon footprint. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <div style={containerStyle} className="container mt-5">
        <h1 className="text-center mb-4">Eco-Trackify Emission Calculator</h1>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Transportation Emission:</label>
            <input
              type="number"
              className="form-control"
              value={transportationEmission} // Remains empty initially
              onChange={handleInputChange(setTransportationEmission)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Energy Consumption:</label>
            <input
              type="number"
              className="form-control"
              value={energyConsumption} // Remains empty initially
              onChange={handleInputChange(setEnergyConsumption)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Waste Disposal:</label>
            <input
              type="number"
              className="form-control"
              value={wasteDisposal} // Remains empty initially
              onChange={handleInputChange(setWasteDisposal)}
            />
          </div>

          {/* Display error message */}
          {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>

        {/* Display total footprint above the chart */}
        <div style={totalDisplayStyle}>
          Total Carbon Footprint: {totalFootprint} kg CO₂
        </div>

        <div className="mt-5 d-flex justify-content-center">
          <div className="w-50">
            <Pie data={data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
