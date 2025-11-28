import React, { createContext, useState, useEffect } from "react";

// Create context
export const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🟡 Fetch cart items from backend when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/customer/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // Transform backend cart data to frontend-friendly format
        const mappedItems = data.map(item => ({
          _id: item.productId._id,
          productName: item.productId.productName,
          price: item.productId.bulkPrice,
          quantity: item.quantity,
          unit: item.productId.measurementUnit,
          image: item.productId.images?.[0] || "default.png",
          type: "bulk",
          seller: item.productId.sellerName || "Unknown",
        }));

        setCartItems(mappedItems);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCart();
  }, []);

  // Toggle cart modal visibility
  const toggleModal = () => setIsCartOpen(!isCartOpen);

  // Add item to cart
  const addToCart = (item) => {
    const exists = cartItems.find(p => p._id === item._id);
    let updatedCart;

    if (exists) {
      updatedCart = cartItems.map(p =>
        p._id === item._id ? { ...p, quantity: p.quantity + item.quantity } : p
      );
    } else {
      updatedCart = [...cartItems, item];
    }

    setCartItems(updatedCart);

    // 🔄 Sync to backend
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/customer/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart: updatedCart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            type: item.type,
          })),
        }),
      }).catch(err => console.error("Error saving cart:", err));
    }
  };

  // Remove item from cart
  const removeFromCart = (_id) => {
    const updatedCart = cartItems.filter(item => item._id !== _id);
    setCartItems(updatedCart);

    // Update DB after removal
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/customer/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart: updatedCart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            type: item.type,
          })),
        }),
      }).catch(err => console.error("Error updating cart:", err));
    }
  };

  // Increase quantity
  const increaseQty = (_id) => {
    const updatedCart = cartItems.map(item =>
      item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    syncCartWithBackend(updatedCart);
  };

  // Decrease quantity
  const decreaseQty = (_id) => {
    const updatedCart = cartItems.map(item =>
      item._id === _id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    syncCartWithBackend(updatedCart);
  };

  // Sync cart with backend
  const syncCartWithBackend = (updatedCart) => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/customer/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart: updatedCart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            type: item.type,
          })),
        }),
      }).catch(err => console.error("Error syncing cart:", err));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        isCartOpen,
        toggleModal,
      }}
    >
      {children}

      {/* Cart Modal */}
      {isCartOpen && (
        <div style={modalStyle}>
          <div style={headerStyle}>
            <h2>🛒 Shopping Cart</h2>
            <button onClick={toggleModal} style={closeButton}>❌</button>
          </div>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item._id} style={itemStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.productName}
                    style={imgStyle}
                  />
                  <div>
                    <strong>{item.productName}</strong>
                    <p style={{ margin: "4px 0" }}>{item.seller}</p>
                    <span style={typeStyle}>{item.type}</span>
                  </div>
                </div>

                <div style={actionsStyle}>
                  <div>
                    <button onClick={() => decreaseQty(item._id)} style={qtyButton}>−</button>
                    <span style={{ margin: "0 10px", fontWeight: "bold" }}>{item.quantity}</span>
                    <button onClick={() => increaseQty(item._id)} style={qtyButton}>+</button>
                  </div>
                  <div style={{ fontWeight: "bold" }}>₹{item.price * item.quantity}</div>
                  <button onClick={() => removeFromCart(item._id)} style={deleteButton}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </CartContext.Provider>
  );
};

// 🔧 Style objects
const modalStyle = {
  position: "fixed",
  top: "0",
  right: "0",
  width: "400px",
  height: "100%",
  backgroundColor: "#fff",
  boxShadow: "-2px 0 10px rgba(0,0,0,0.3)",
  zIndex: 1000,
  overflowY: "auto",
  padding: "20px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeButton = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
};

const itemStyle = {
  border: "1px solid #eee",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  backgroundColor: "#f9f9f9",
};

const imgStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "6px",
  objectFit: "cover",
};

const typeStyle = {
  backgroundColor: "#e0ecff",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
};

const actionsStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
};

const qtyButton = {
  padding: "4px 10px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#f0f0f0",
};

const deleteButton = {
  background: "none",
  border: "none",
  color: "red",
  fontSize: "18px",
  cursor: "pointer",
};
