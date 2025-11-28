import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";
import { WishlistContext } from "./WishlistContext";

const categories = [
  { name: "All Products", icon: "🌿" },
  { name: "Cereals", icon: "🌾" },
  { name: "Pulses", icon: "🫘" },
  { name: "Vegetables", icon: "🥕" },
  { name: "Fruits", icon: "🍎" },
  { name: "Grains", icon: "🌰" },
  { name: "Millets", icon: "🌽" },
];

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedTheme, setSelectedTheme] = useState("Light");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const { cartItems, addToCart, toggleModal, setCartItems} = useContext(CartContext);
  const {
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    isWishlistOpen,
    toggleWishlistModal,
    setWishlistItems
  } = useContext(WishlistContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    contactNumber: "",
    address: ""
  });
  const [customerDetails, setCustomerDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [search, selectedCategory, products]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:5000/api/customer/cart-wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.cart && Array.isArray(data.cart)) {
        setCartItems(data.cart.map(item => ({
          _id: item.productId._id,
          productName: item.productId.productName,
          quantity: item.quantity,
          unit: item.productId.measurementUnit,
          price: item.productId.bulkPrice,
          type: item.type,
          image: item.productId.images?.[0] || "default.jpg",
          seller: item.productId.sellerName,
        })));
      }

      if (data.wishlist && Array.isArray(data.wishlist)) {
        setWishlistItems(data.wishlist.map(item => item.productId));
      }
    })
    .catch((err) => console.error("Failed to load cart/wishlist:", err));
}, []);

const handleAddToCart = async (product) => {
  const bulkItem = {
    _id: product._id,
    productName: product.productName,
    quantity: product.bulkQuantity,
    unit: product.measurementUnit,
    price: product.bulkPrice,
    type: "bulk",
    maxBulkQuantity: product.maxBulkQuantity || 999,
    image: product.images?.[0] || "default.jpg",
    seller: product.sellerName,
  };

  addToCart(bulkItem);

  const token = localStorage.getItem("token");
  await fetch("http://localhost:5000/api/customer/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId: product._id, quantity: product.bulkQuantity })
  });
};



  const openProfileModal = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/auth/customer/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setCustomerDetails(data);
      setEditData({
        name: data.name || "",
        contactNumber: data.contactNumber || "",
        address: data.address || ""
      });
      setIsProfileOpen(true);
    } catch (err) {
      console.error(err);
      alert("Could not fetch profile. Please log in again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="FarmFresh Logo" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
          <h2 style={{ margin: 0 }}>FarmConnect</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "50px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search for fresh produce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "400px",
              fontSize: "15px",
            }}
          />

          {/* Wishlist Icon */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={toggleWishlistModal}>
            <span role="img" aria-label="wishlist" style={{ fontSize: "28px" }}>💝</span>
            {wishlistItems.length > 0 && (
              <div style={{
                position: "absolute",
                top: "-8px",
                right: "-10px",
                background: "#ff6666",
                color: "white",
                fontSize: "12px",
                borderRadius: "50%",
                padding: "2px 6px",
                fontWeight: "bold"
              }}>
                {wishlistItems.length}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={toggleModal}>
            <span role="img" aria-label="cart" style={{ fontSize: "28px" }}>🛒</span>
            {cartItems.length > 0 && (
              <div style={{
                position: "absolute",
                top: "-8px",
                right: "-10px",
                background: "#00b386",
                color: "white",
                fontSize: "12px",
                borderRadius: "50%",
                padding: "2px 6px",
                fontWeight: "bold"
              }}>
                {cartItems.length}
              </div>
            )}
          </div>

          {/* Profile Icon */}
          <span role="img" aria-label="profile" style={{ fontSize: "28px", cursor: "pointer" }} onClick={openProfileModal}>👤</span>
        </div>
      </div>

      {/* Category Buttons */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {categories.map((cat) => (
          <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            backgroundColor: selectedCategory === cat.name ? "#d6f5e8" : "#fff",
            fontWeight: selectedCategory === cat.name ? "bold" : "normal",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Product Section */}
      <h2>All Products</h2>
      <p>{filteredProducts.length} products found</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        {filteredProducts.map((product, index) => (
          <div key={index} style={{
            width: "336px",
            border: "2px solid #ddd",
            borderRadius: "15px",
            overflow: "hidden",
            backgroundColor: "#fff",
            position: "relative",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
            <div onClick={() => toggleWishlist(product)} style={{
              position: "absolute", top: "10px", right: "10px", fontSize: "24px", cursor: "pointer"
            }}>
              {isInWishlist(product._id) ? "❤️" : "🤍"}
            </div>
            <img src={`http://localhost:5000/uploads/${product.images?.[0] || "default.jpg"}`} alt={product.productName} style={{
              width: "100%", height: "200px", objectFit: "cover"
            }} />
            <div style={{ padding: "15px" }}>
              <h3>{product.productName}</h3>
              <p><strong>📍 Location:</strong> {product.address}</p>
              <div style={{
                backgroundColor: "#e6fff4",
                padding: "8px",
                borderRadius: "6px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                color: "#00966C",
              }}>
                <span>📦 Sample ({product.sampleQuantity} {product.measurementUnit})</span>
                <span>₹{product.samplePrice}</span>
              </div>
              <div style={{
                backgroundColor: "#eef4ff",
                padding: "8px",
                borderRadius: "6px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                color: "#1A56DB",
              }}>
                <span>⚖ Bulk (min {product.bulkQuantity} {product.measurementUnit})</span>
                <span>₹{product.bulkPrice}</span>
              </div>
              <button style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#00aa66",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                marginBottom: "6px",
                cursor: "pointer"
              }}>
                Buy Sample
              </button>
              <button onClick={() => handleAddToCart(product)} style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#2e64ff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer"
              }}>🛒 Add to Cart (Bulk)</button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div style={{
          position: "fixed", top: "100px", right: "40px", width: "420px", background: "#fff",
          padding: "24px", borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.3)", zIndex: 1000
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3>👤 My Account</h3>
            <span style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => { setIsProfileOpen(false); setIsEditing(false); }}>✖</span>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            {["Profile", "Orders", "Settings"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: activeTab === tab ? "#e6fff4" : "#f9f9f9",
                  border: activeTab === tab ? "2px solid #00aa66" : "1px solid #ccc",
                  cursor: "pointer",
                  fontWeight: activeTab === tab ? "bold" : "normal"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Profile" && !isEditing && customerDetails && (
            <>
              <p><strong>Name:</strong> {customerDetails.name}</p>
              <p><strong>Email:</strong> {customerDetails.email}</p>
              <p><strong>Contact Number:</strong> {customerDetails.contactNumber}</p>
              <p><strong>Address:</strong> {customerDetails.address}</p>

              <button
                style={{
                  marginTop: "10px",
                  padding: "10px 16px",
                  backgroundColor: "#eee",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            </>
          )}

          {activeTab === "Profile" && isEditing && customerDetails && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Name:</label><br />
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Contact Number:</label><br />
                <input
                  type="text"
                  value={editData.contactNumber}
                  onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                  style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Address:</label><br />
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
                />
              </div>

              <button
                style={{
                  marginRight: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#00aa66",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch("http://localhost:5000/api/auth/customer/profile", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify(editData)
                    });

                    if (!res.ok) throw new Error("Failed to update");

                    const updated = await res.json();
                    setCustomerDetails(updated);
                    setIsEditing(false);
                    alert("Profile updated successfully");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to update profile");
                  }
                }}
              >
                💾 Save changes
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#eee",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </button>
            </>
          )}

          {activeTab === "Orders" && <p>📦 Orders feature coming soon...</p>}

          {activeTab === "Settings" && (
            <div>
              <h4 style={{ marginBottom: "14px" }}>Settings</h4>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontWeight: "bold" }}>🌐 Language</label><br />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc"
                  }}
                >
                  <option value="English">English (English)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                </select>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontWeight: "bold" }}>🎨 Theme</label><br />
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  style={{
                    width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc"
                  }}
                >
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: "bold" }}>🔔 Notifications</label><br />
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  style={{ marginRight: "8px" }}
                />
                Email Notifications
              </div>
            </div>
          )}
        </div>
      )}
      
{isWishlistOpen && (
  <div
    style={{
      position: "fixed",
      top: "100px",
      right: "40px",
      width: "460px",
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0,0,0,0.3)",
      zIndex: 1000,
      maxHeight: "80vh",
      overflowY: "auto"
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
        <span style={{ fontSize: "22px" }}>❤️</span> Wishlist
        <span style={{
          backgroundColor: "#ffe6e6",
          color: "#cc0000",
          fontSize: "14px",
          padding: "2px 8px",
          borderRadius: "12px",
          fontWeight: "bold"
        }}>{wishlistItems.length} items</span>
      </h3>
      <span
        style={{ cursor: "pointer", fontSize: "22px" }}
        onClick={toggleWishlistModal}
      >
        ✖
      </span>
    </div>

    {wishlistItems.length === 0 ? (
      <p>No items in wishlist.</p>
    ) : (
      wishlistItems.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "16px",
            backgroundColor: "#fafafa",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "16px",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
          }}
        >
          <img
            src={`http://localhost:5000/uploads/${item.images?.[0] || "default.jpg"}`}
            alt={item.productName}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <div style={{ flexGrow: 1 }}>
            <h4 style={{ margin: "0 0 4px 0" }}>{item.productName}</h4>
            <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#555" }}>{item.seller}</p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
              <strong style={{ color: "green" }}>Sample:</strong> ₹{item.samplePrice} &nbsp;&nbsp;
              <strong style={{ color: "#1A56DB" }}>Bulk:</strong> ₹{item.bulkPrice}/{item.unit}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{
                padding: "6px 12px",
                backgroundColor: "#008c5f",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>Buy Sample</button>
              <button
                onClick={() => handleAddToCart(item)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#1A56DB",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                🛒 Add Bulk
              </button>
              <button
                onClick={() => toggleWishlist(item)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  color: "#cc0000",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}


    </div> 
  );
};

export default CustomerHome;
