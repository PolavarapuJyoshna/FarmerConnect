import React from "react";
import { useNavigate } from "react-router-dom";

const ProductSuccess = () => {
  const navigate = useNavigate();
  //alert("Navigating to uploaded products...");

  // Styles
  const containerStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: 'url("/minibg1.jpg") no-repeat center center/cover',
    textAlign: "center",
    overflow: "hidden",
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

      <div style={quoteContainerStyle}>
        <p style={quoteStyle}>
          "Product uploaded successfully!..😊"
        </p>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => navigate("/see-uploaded-products")}
        >
          see uploaded products
        </button>
      </div>
    </div>
  );
};

export default ProductSuccess;
