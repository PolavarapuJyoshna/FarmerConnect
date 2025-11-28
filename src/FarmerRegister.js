import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { globalContext } from "./App";

function FarmerRegister() {
  const [farmerId, setFarmerId] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');
  const navigate = useNavigate();

  const { setGlobalUserObject } = useContext(globalContext);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const submitData = async (event) => {
    event.preventDefault();

    if (!farmerId || !name || !contactNumber || !password || !confirmPassword || !address) {
      setRegisterMsg('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setRegisterMsg('Both password and confirm password must be the same');
      return;
    }

    const obj = { farmerId, name, contactNumber, password, address };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register/farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterMsg("Registration successful!");
        setGlobalUserObject(data);
        navigate("/farmer-select");
      } else {
        setRegisterMsg(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setRegisterMsg("Something went wrong. Please try again.");
    }
  };
  
  const goBack = () => {
    navigate('/farmer-login');
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/minibg1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const cardStyle = {
    width: "350px",
    padding: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
  };

  const buttonStyle = {
    padding: "5px 10px",
    fontSize: "12px",
    width: "65px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const registerButton = { ...buttonStyle, backgroundColor: "green" };
  const backButton = { ...buttonStyle, backgroundColor: "#6c757d" };

  return (
    <div className="register-container" style={containerStyle}>
      <div className="card" style={cardStyle}>
        <form onSubmit={submitData} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4>Register</h4>
          <p>Provide your details to register</p>
          <label><b>Farmer Id</b></label>
          <input type="text" placeholder="Farmer ID" value={farmerId} onChange={handleInputChange(setFarmerId)} />
          <label><b>Farmer Name</b></label>
          <input type="text" placeholder="Name" value={name} onChange={handleInputChange(setName)} />
          <label><b>Contact Number</b></label>
          <input type="text" placeholder="Contact Number" value={contactNumber} onChange={handleInputChange(setContactNumber)} />
          <label><b>Password</b></label>
          <input type="password" placeholder="Password" value={password} onChange={handleInputChange(setPassword)} />
          <label><b>Confirm Password</b></label>
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleInputChange(setConfirmPassword)} />
          <label><b>Address</b></label>
          <input type="text" placeholder="Address" value={address} onChange={handleInputChange(setAddress)} />
          <button type="submit" style={{ padding: '5px 10px', fontSize: '12px', width: '65px', backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Register</button>
          <button type="button" onClick={goBack} style={backButton}>Back</button>
          <p>{registerMsg}</p>
        </form>
      </div>
    </div>
  );
}

export default FarmerRegister;
