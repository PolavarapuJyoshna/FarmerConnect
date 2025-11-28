import React from "react";
import { useNavigate } from "react-router-dom";

const Select = () => {
  const navigate = useNavigate();

  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/minibg1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    textAlign: "center",
    color: "black",
  };

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "16px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1>Select Your Role</h1>
      <button style={buttonStyle} onClick={() => navigate("/farmer-login")}>
        Farmer
      </button>
      <button style={buttonStyle} onClick={() => navigate("/customer-login")}>
        Buyer
      </button>
    </div>
  );
};

export default Select;
