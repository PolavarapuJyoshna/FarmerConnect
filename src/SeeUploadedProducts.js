import React, { useEffect, useState } from "react";

const SeeUploadedProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updatedImages, setUpdatedImages] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
        setProducts(products.filter((product) => product._id !== id));
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({ ...selectedProduct });
    setUpdatedImages({});
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    setUpdatedImages({ ...updatedImages, [index]: e.target.files[0] });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("category", editData.category);
    formData.append("productName", editData.productName);
    formData.append("address", editData.address);
    formData.append("measurementUnit", editData.measurementUnit);
    formData.append("sampleQuantity", editData.sampleQuantity);
    formData.append("samplePrice", editData.samplePrice);
    formData.append("bulkQuantity", editData.bulkQuantity);
    formData.append("bulkPrice", editData.bulkPrice);

    Object.keys(updatedImages).forEach((index) => {
      formData.append(`images[${index}]`, updatedImages[index]);
    });

    try {
      const res = await fetch(`http://localhost:5000/api/products/${editData._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);

      setProducts(products.map((p) => (p._id === editData._id ? data.updatedProduct : p)));
      setSelectedProduct(data.updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <h2>Uploaded Products</h2>
      {products.length === 0 ? (
        <p>No products uploaded yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {products.map((product) => (
            <div
              key={product._id}
              style={{ border: "1px solid black", padding: "10px", borderRadius: "5px", cursor: "pointer" }}
              onClick={() => setSelectedProduct(product)}
            >
              <h3>{product.category}</h3>
              <p><strong>Product Name:</strong> {product.productName}</p>
              <p><strong>Address:</strong> {product.address}</p>
              <p><strong>Measurement Unit:</strong> {product.measurementUnit}</p>
              <p><strong>Sample Quantity:</strong> {product.sampleQuantity}</p>
              <p><strong>Sample Price:</strong> ₹{product.samplePrice}</p>
              <p><strong>Bulk Price:</strong> ₹{product.bulkPrice}</p>
              <p><strong>Bulk Quantity:</strong> {product.bulkQuantity}</p>
              {product.images.length > 0 && (
                <img
                  src={`http://localhost:5000/uploads/${product.images[0]}`}
                  alt="Product"
                  style={{ width: "100px", height: "100px", margin: "5px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default.jpg";
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "50%", maxHeight: "90vh", overflowY: "auto" }}>
            {isEditing ? (
              <>
                <h2>Edit Product</h2>
                <label>Category: <input type="text" name="category" value={editData.category} onChange={handleInputChange} /></label>
                <label>Product Name: <input type="text" name="productName" value={editData.productName} onChange={handleInputChange} /></label>
                <label>Address: <input type="text" name="address" value={editData.address} onChange={handleInputChange} /></label>
                <label>Measurement Unit: <input type="text" name="measurementUnit" value={editData.measurementUnit} onChange={handleInputChange} /></label>
                <label>Sample Quantity: <input type="number" name="sampleQuantity" value={editData.sampleQuantity} onChange={handleInputChange} /></label>
                <label>Sample Price: <input type="number" name="samplePrice" value={editData.samplePrice} onChange={handleInputChange} /></label>
                <label>Bulk Quantity: <input type="number" name="bulkQuantity" value={editData.bulkQuantity} onChange={handleInputChange} /></label>
                <label>Bulk Price: <input type="number" name="bulkPrice" value={editData.bulkPrice} onChange={handleInputChange} /></label>
                <h3>Images:</h3>
                {selectedProduct.images.map((img, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <img src={`http://localhost:5000/uploads/${img}`} alt="Product" style={{ width: "100px", height: "100px" }} onError={(e) => { e.target.onerror = null; e.target.src = "/default.jpg"; }} />
                    <input type="file" onChange={(e) => handleImageChange(e, index)} />
                  </div>
                ))}
                <button onClick={handleUpdate} style={{ background: "green", color: "white", marginTop: "10px" }}>Save Changes</button>
                <button onClick={() => setIsEditing(false)} style={{ background: "gray", color: "white", marginLeft: "10px" }}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{selectedProduct.category}</h2>
                <p><strong>Product Name:</strong> {selectedProduct.productName}</p>
                <p><strong>Address:</strong> {selectedProduct.address}</p>
                <div style={{ display: "flex", overflowX: "auto", gap: "10px", padding: "10px" }}>
                  {selectedProduct.images.map((img, index) => (
                    <img key={index} src={`http://localhost:5000/uploads/${img}`} alt="Product" style={{ width: "200px", height: "200px" }} onError={(e) => { e.target.onerror = null; e.target.src = "/default.jpg"; }} />
                  ))}
                </div>
                <button onClick={handleEditClick} style={{ background: "blue", color: "white", marginTop: "10px" }}>Edit</button>
                <button onClick={() => handleDelete(selectedProduct._id)} style={{ background: "red", color: "white", marginLeft: "10px" }}>Delete</button>
              </>
            )}
            <button onClick={() => setSelectedProduct(null)} style={{ marginTop: "10px", background: "gray", color: "white" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeUploadedProducts;
