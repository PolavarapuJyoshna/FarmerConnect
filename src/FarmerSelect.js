import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate for navigation

const FarmerSelect = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const options = [
    { name: "See Orders", image: "/see-orders.jpg", route: "/see-orders"},
    { name: "Upload New Product", image: "/upload-product.jpg", route: "/farmer-upload-form" }, // Added route for navigation
    { name: "Uploaded Products", image: "/farmer-check.jpg", route: "/see-uploaded-products"},
  ];

  const styles = {
    containerStyle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: "url('/minibg1.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    profileButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      padding: "5px 10px",
      border: "1px solid black",
      borderRadius: "5px",
      textDecoration: "none",
      fontSize: "14px",
      cursor: "pointer",
    },
    dashboard: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "2rem",
      margin: "2rem",
      height: "100vh",
    },
    dashboardItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textAlign: "center",
      transition: "transform 0.2s",
    },
    dashboardIcon: {
      width: "200px",
      height: "200px",
      marginBottom: "0.5rem",
      border: "3px solid #333",
      borderRadius: "8px",
      padding: "5px",
    },
    dashboardName: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#333",
    },
  };

  const handleNavigation = (route) => {
    if (route) {
      navigate(route); // Navigate to the specified route
    }
  };

  return (
      <div style={styles.pageContainer}>
        <Link to="/farmer-profile" style={styles.profileButton}>
          Profile
        </Link>
    <div style={styles.containerStyle}>
      <div style={styles.dashboard}>
        {options.map((option, index) => (
          <div
            key={index}
            style={styles.dashboardItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
            onClick={() => handleNavigation(option.route)} // Call handleNavigation on click
          >
            <img
              src={process.env.PUBLIC_URL + option.image}
              alt={option.name}
              style={styles.dashboardIcon}
            />
            <p style={styles.dashboardName}>{option.name}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default FarmerSelect;
