import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FarmerUploadForm = () => {
  const [images, setImages] = useState([]);
  const [unit, setUnit] = useState("kilogram");
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      name: file.name,
      src: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Append uploaded images
    images.forEach((img) => {
      formData.append("images", img.file);
    });

    // Find selected item and its category
    const categories = ["cereals", "millets", "grains", "pulses", "fruits", "vegetables"];
    let selectedCategory = "";
    let selectedProductName = "";

    categories.forEach((cat) => {
      const value = formData.get(cat);
      if (value) {
        selectedCategory = cat.charAt(0).toUpperCase() + cat.slice(1); // e.g., vegetables → Vegetables
        selectedProductName = value;
      }
      formData.delete(cat); // remove dropdown values to avoid unnecessary fields
    });

    formData.append("category", selectedCategory);
    formData.append("productName", selectedProductName);

    try {
      const response = await fetch("http://localhost:5000/api/products/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        //alert("Product uploaded successfully!");
        navigate("/product-success");
      } else {
        alert("Failed to upload product");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Error uploading product");
    }
  };

  const handleUnitChange = (e) => setUnit(e.target.value);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/minibg1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          maxWidth: "800px",
          margin: "20px auto",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Farmer Product Upload Form
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "13px" }}
        >
          {/* Dropdowns for categories */}
          <div>
            <label>Cereals:</label>
            <select name="cereals">
              <option value="">Select Cereals</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
              <option value="barley">Barley</option>
            </select>
          </div>

          <div>
            <label>Millets:</label>
            <select name="millets">
              <option value="">Select Millets</option>
              <option value="bajra">Bajra</option>
              <option value="ragi">Ragi</option>
              <option value="korra">Korra</option>
              <option value="sorghum">Sorghum</option>
            </select>
          </div>

          <div>
            <label>Grains:</label>
            <select name="grains">
              <option value="">Select Grains</option>
              <option value="quinoa">Quinoa</option>
              <option value="oats">Oats</option>
              <option value="buckwheat">Buckwheat</option>
              <option value="barley">Barley</option>
            </select>
          </div>

          <div>
            <label>Pulses:</label>
            <select name="pulses">
              <option value="">Select Pulses</option>
              <option value="chickpeas">Chickpeas</option>
              <option value="lentils">Lentils</option>
              <option value="beans">Kidney Beans</option>
              <option value="black gram">Black Gram</option>
            </select>
          </div>

          <div>
            <label>Fruits:</label>
            <select name="fruits">
              <option value="">Select Fruits</option>
              <option value="apple">Apple</option>
              <option value="banana">Banana</option>
              <option value="grapes">Grapes</option>
              <option value="mango">Mango</option>
            </select>
          </div>

          <div>
            <label>Vegetables:</label>
            <select name="vegetables">
              <option value="">Select Vegetables</option>
              <option value="carrot">Carrot</option>
              <option value="tomato">Tomato</option>
              <option value="potato">Potato</option>
              <option value="onion">Onion</option>
              <option value="beet root">Beet Root</option>
            </select>
          </div>

          {/* Address Field */}
          <div>
            <label>Address:</label>
            <textarea
              name="address"
              required
              placeholder="Enter your address"
              style={{ width: "100%", minHeight: "40px", resize: "none" }}
            ></textarea>
          </div>

          {/* Measurement Unit */}
          <div>
            <label>Measurement Unit:</label>
            <select name="measurementUnit" onChange={handleUnitChange}>
              <option value="kilogram">Kilogram</option>
              <option value="dozen">Dozen</option>
            </select>
          </div>

          {/* Quantity and Price */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <label>Sample Quantity ({unit}):</label>
              <input
                type="number"
                name="sampleQuantity"
                required
                placeholder={`e.g., 2 ${unit}`}
              />
            </div>
            <div>
              <label>Sample Price (₹):</label>
              <input type="number" name="samplePrice" required placeholder="e.g., 50" />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <label>Bulk Quantity ({unit}):</label>
              <input
                type="number"
                name="bulkQuantity"
                required
                placeholder={`e.g., 50 ${unit}`}
              />
            </div>
            <div>
              <label>Bulk Price (₹):</label>
              <input type="number" name="bulkPrice" required placeholder="e.g., 2000" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label>Upload Images (Max 4):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
              {images.map((img, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <img
                    src={img.src}
                    alt={`Uploaded ${index + 1}`}
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                  />
                  <p style={{ fontSize: "12px", marginTop: "5px" }}>{img.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerUploadForm;
