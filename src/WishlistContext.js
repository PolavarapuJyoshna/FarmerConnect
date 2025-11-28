import React, { createContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const WishlistContext = createContext();


export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/customer/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setWishlistItems(data);
  };

  fetchWishlist();
}, []);



  const toggleWishlist = async (product) => {
  const token = localStorage.getItem("token");

  const isIn = isInWishlist(product._id);
  if (isIn) {
    setWishlistItems(wishlistItems.filter(item => item._id !== product._id));
    await fetch("http://localhost:5000/api/customer/wishlist/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId: product._id })
    });
  } else {
    setWishlistItems([...wishlistItems, product]);
    await fetch("http://localhost:5000/api/customer/wishlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId: product._id })
    });
  }
};
  const removeFromWishlist = (id) => {
  setWishlistItems((prev) => {
    const updatedWishlist = prev.filter((item) => item._id !== id);

    // ✅ Sync to backend
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/customer/wishlist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wishlist: updatedWishlist.map((item) => item._id),
        }),
      }).catch((err) => console.error("Error saving wishlist:", err));
    }

    return updatedWishlist;
  });
};


  const toggleWishlistModal = () => {
    setIsWishlistOpen((prev) => !prev);
    // After updating wishlistItems, sync to backend
const token = localStorage.getItem("token");
if (token) {
  fetch("http://localhost:5000/api/customer/wishlist", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      wishlist: wishlistItems.map(item => item._id)
    })
  }).catch(err => console.error("Error saving wishlist:", err));
}

  };

  // ✅ Added this helper function
  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item._id === id);
  };

  const renderModal = () => {
    if (!isWishlistOpen) return null;

    return createPortal(
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000,
        display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        <div style={{
          backgroundColor: "#fff", width: "600px", maxHeight: "80vh",
          overflowY: "auto", borderRadius: "10px", padding: "20px", position: "relative"
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"
          }}>
            <h2 style={{ margin: 0 }}>
              <span role="img" aria-label="wishlist">💝</span> Wishlist
              <span style={{
                background: "#ffdada",
                color: "#d60000",
                marginLeft: "10px",
                padding: "3px 8px",
                borderRadius: "12px",
                fontSize: "14px"
              }}>{wishlistItems.length} items</span>
            </h2>
            <span style={{ fontSize: "20px", cursor: "pointer" }} onClick={toggleWishlistModal}>✖</span>
          </div>

          {wishlistItems.map((product) => (
            <div key={product._id} style={{
              display: "flex", gap: "15px", padding: "12px",
              borderRadius: "10px", backgroundColor: "#fafafa", marginBottom: "16px"
            }}>
              <img
                src={`http://localhost:5000/uploads/${product.images?.[0] || "default.jpg"}`}
                alt={product.productName}
                style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }}
              />
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: "0 0 5px" }}>{product.productName}</h4>
                <p style={{ margin: "0 0 8px", fontSize: "14px" }}>{product.sellerName}</p>
                <p style={{ margin: "0 0 8px" }}>
                  <span style={{ color: "green" }}>Sample: ₹{product.samplePrice}</span> &nbsp;
                  <span style={{ color: "blue" }}>Bulk: ₹{product.bulkPrice}/{product.measurementUnit}</span>
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{
                    padding: "6px 12px", backgroundColor: "#008000",
                    color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px"
                  }}>Buy Sample</button>

                  <button
                    onClick={() => {
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
                      const event = new CustomEvent("add-to-cart", { detail: bulkItem });
                      window.dispatchEvent(event);
                    }}
                    style={{
                      padding: "6px 12px", backgroundColor: "#2e64ff",
                      color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px"
                    }}
                  >
                    🛒 Add Bulk
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    style={{
                      padding: "6px 12px", backgroundColor: "transparent",
                      color: "red", border: "none", borderRadius: "4px", fontSize: "14px"
                    }}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      removeFromWishlist,
      toggleWishlistModal,
      isWishlistOpen,
      renderModal,
      isInWishlist // ✅ Added here
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
