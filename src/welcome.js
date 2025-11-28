import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  // Styles
  const containerStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: 'url("/miniprohome.jpg") no-repeat center center/cover',
    textAlign: "center",
    overflow: "hidden",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  };

  const quoteContainerStyle = {
    position: "relative",
    zIndex: 1,
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
    color: "black",
  };

  const quoteStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
  };

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "16px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <div style={quoteContainerStyle}>
        <p style={quoteStyle}>
        "Empowering farmers to thrive and connect with customers, one click at
          a time, bringing fresh, quality produce for a healthier, more
          sustainable future, where everyone benefits from direct and easy
          access to farm-fresh products."
        </p>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => navigate("/select")}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
