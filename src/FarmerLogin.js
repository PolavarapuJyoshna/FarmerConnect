import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FarmerLogin() {
  const farmerIdRef = useRef(null);
  const passwordRef = useRef(null);
  const [loginMessage, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    farmerIdRef.current.focus();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const farmerId = farmerIdRef.current.value; // Changed from name to farmerId
    const password = passwordRef.current.value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login/farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmerId, password }), // Updated key to farmerId
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT token
        setMessage("Login successful!");
        navigate("/farmer-select"); // Redirect to Farmer Dashboard
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }

    farmerIdRef.current.value = "";
    passwordRef.current.value = "";
  };

  const goToRegister = () => {
    navigate("/farmer-register"); // Redirect to Farmer Register page
  };

  // Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/minibg1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const buttonStyle = {
    padding: "5px 10px",
    fontSize: "12px",
    width: "65px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white",
    border: "none",
  };

  const loginButton = { ...buttonStyle, backgroundColor: "green" };
  const backButton = { ...buttonStyle, backgroundColor: "#6c757d", marginTop: "2px" };

  return (
    <div style={containerStyle}>
      <div
        className="card"
        style={{
          width: "290px",
          padding: "30px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <h4>Farmer Login</h4>
          <p>Provide your details to login</p>
          <label><b>Farmer ID</b></label> {/* Updated label */}
          <input type="text" ref={farmerIdRef} required />
          <label><b>Password</b></label>
          <input type="password" ref={passwordRef} required />
          <button type="submit" style={loginButton}>Login</button>
          <p>NO ACCOUNT?{" "}
            <span onClick={goToRegister} style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}>
              Register
            </span>
          </p>
          <button type="button" style={backButton} onClick={() => navigate("/select")}>Back</button>
        </form>
        {loginMessage && <p>{loginMessage}</p>}
      </div>
    </div>
  );
}

export default FarmerLogin;
