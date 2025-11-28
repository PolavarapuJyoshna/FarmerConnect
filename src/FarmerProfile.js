import { useContext, useState, useEffect } from "react";
import { globalContext } from "./App";
import { useNavigate } from "react-router-dom";

function FarmerProfile() {
  const { globalUserObject, setGlobalIsLogin } = useContext(globalContext);
  const [showPassword, setShowPassword] = useState(false);
  const [registerMsg, setRegisterMsg] = useState('');
  const [farmerNameVal, setFarmerName] = useState('');
  const [farmerIdVal, setFarmerId] = useState('');
  const [contactNumberVal, setContactNumber] = useState('');
  const [passwordVal, setPassword] = useState('');
  const [addressVal, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Use the correct property names from globalUserObject
    if (globalUserObject) {
      setFarmerName(globalUserObject.farmerName || '');
      setFarmerId(globalUserObject.farmerId || '');
      setContactNumber(globalUserObject.contactNumber || '');
      setPassword(globalUserObject.password || '');
      setAddress(globalUserObject.address || '');
    }
  }, [globalUserObject]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const logoutAction = () => {
    setGlobalIsLogin(false);
    navigate("/farmer-login"); // Navigate to the login page after logout
  };

  const updateProfile = () => {
    if (!farmerNameVal || !farmerIdVal  || !passwordVal || !contactNumberVal || !addressVal) {
      setRegisterMsg("All fields are required to update the profile");
      return;
    }

    // Simulate profile update
    const updatedProfile = {
      farmerId: farmerIdVal,
      farmerName: farmerNameVal,
      contactNumber: contactNumberVal,
      password: passwordVal,
      address: addressVal,
    };
    console.log("Profile updated:", updatedProfile);
    setRegisterMsg("Profile updated successfully!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Profile</h2>
        <p>Update your details</p>

        <div style={styles.field}>
          <label><b>Farmer Name:</b></label>
          <p>{farmerNameVal}</p>
        </div>

        <div style={styles.field}>
          <label><b>Farmer ID:</b></label>
          <p>{farmerIdVal}</p>
        </div>

        <div style={styles.field}>
          <label><b>Contact Number:</b></label>
          <p>{contactNumberVal}</p>
        </div>

        <div style={styles.field}>
          <label><b>Password:</b></label>
          <p>
            {showPassword ? passwordVal : "*".repeat(passwordVal.length)}
            <u onClick={togglePasswordVisibility} style={styles.togglePassword}>
              {showPassword ? "Hide" : "Show"}
            </u>
          </p>
        </div>
        <div style={styles.field}>
          <label><b>Address:</b></label>
          <p>{addressVal}</p>
        </div>

        <button className="btn btn-dark" onClick={updateProfile}>Update Profile</button>
        <button className="btn btn-secondary" onClick={logoutAction} style={styles.logoutButton}>
          Log Out
        </button>

        {registerMsg && <p style={styles.message}>{registerMsg}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/minibg1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    width: "350px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  field: {
    marginBottom: "15px",
  },
  togglePassword: {
    marginLeft: "10px",
    cursor: "pointer",
    color: "#007bff",
  },
  logoutButton: {
    marginLeft: "10px",
  },
  message: {
    marginTop: "15px",
    color: "green",
  },
};

export default FarmerProfile;
