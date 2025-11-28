import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Mock API Call to Fetch Products (Replace this with actual API call)
const fetchProductsByCategory = async (category) => {
  try {
    const response = await fetch(`http://localhost:5000/products?category=${category}`); // Replace with actual API URL
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

function CategoryProducts() {
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByCategory(category).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>{category} Products</h1>
      <div style={styles.grid}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={styles.card}>
              <img src={product.image} alt={product.name} style={styles.image} />
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <div style={styles.buttons}>
                <button style={styles.button} onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
                <button style={styles.button} onClick={() => addToWishlist(product)}>
                  Wishlist
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
}

// Function to handle Add to Cart
const addToCart = (product) => {
  alert(`${product.name} added to cart!`);
};

// Function to handle Add to Wishlist
const addToWishlist = (product) => {
  alert(`${product.name} added to wishlist!`);
};

// Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#ff9800",
    border: "none",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CategoryProducts;
