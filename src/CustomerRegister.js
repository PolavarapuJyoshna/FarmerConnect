import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerRegister() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [registerMsg, setRegisterMsg] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (setter) => (event) => setter(event.target.value);

    const submitData = async (event) => {
        event.preventDefault();

        if (!name || !password || !confirmPassword || !email || !contactNumber) {
            setRegisterMsg("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setRegisterMsg("Both password and confirm password must be the same");
            return;
        }

        const obj = { name, password, email, contactNumber, address };

        try {
            const response = await fetch("http://localhost:5000/api/auth/register/customer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(obj),
            });

            const data = await response.json();

            if (response.ok) {
                setRegisterMsg("Registration successful!");
                navigate("/home");
            } else {
                setRegisterMsg(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
            setRegisterMsg("Something went wrong. Please try again.");
        }
    };
        
        const goBack = () => {
          navigate('/customer-login');
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

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <form onSubmit={submitData} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h4>Register</h4>
                    <p>Provide your details to login</p>

                    <label><b>Customer Name</b></label>
                    <input type="text" placeholder='Customer Name' value={name} onChange={handleInputChange(setName)} />

                    <label><b>Password</b></label>
                    <input type="password" placeholder='Password' value={password} onChange={handleInputChange(setPassword)} />

                    <label><b>Confirm Password</b></label>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleInputChange(setConfirmPassword)} />

                    <label><b>Email</b></label>
                    <input type="email" placeholder='Email' value={email} onChange={handleInputChange(setEmail)} />

                    <label><b>Contact Number</b></label>
                    <input type="contactnumber" placeholder='Contact Number' value={contactNumber} onChange={handleInputChange(setContactNumber)} />

                    <label><b>Address</b></label>
                    <input type="text" placeholder="Address" value={address} onChange={handleInputChange(setAddress)} />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" style={{ padding: '5px 10px', fontSize: '12px', width: '65px', backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={goBack}>Back</button>
                        <button type="submit" style={{ padding: '5px 10px', fontSize: '12px', width: '65px', backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Register</button>
                    </div>
                    {registerMsg && <p>{registerMsg}</p>}
                </form>
            </div>
        </div>
    );
}

export default CustomerRegister;