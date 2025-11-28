import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./welcome";
import Select from "./Select";
import FarmerLogin from "./FarmerLogin";
import FarmerRegister from "./FarmerRegister";
import CustomerLogin from "./CustomerLogin";
import CustomerRegister from "./CustomerRegister";
import CustomerHome from "./CustomerHome";
//import Profile from "./CustomerProfile";
import FarmerSelect from "./FarmerSelect";
import FarmerUploadForm from "./FarmerUploadForm";
import ProductSuccess from "./ProductSuccess";
import FarmerProfile from "./FarmerProfile";
import SeeUploadedProducts from "./SeeUploadedProducts";
import CategoryProducts from "./CategoryProducts";
import { CartProvider } from "./CartContext"; // ✅ Correct
import { WishlistProvider } from "./WishlistContext";

export const globalContext = createContext();

const App = () => {
  const [globalUserObject, setGlobalUserObject] = useState(null);
  const [globalIsLogin, setGlobalIsLogin] = useState(false);

  return (
    <globalContext.Provider
      value={{
        globalUserObject,
        setGlobalUserObject,
        globalIsLogin,
        setGlobalIsLogin,
      }}
    >
      <WishlistProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/select" element={<Select />} />
            <Route path="/farmer-login" element={<FarmerLogin />} />
            <Route path="/farmer-register" element={<FarmerRegister />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/farmer-select" element={<FarmerSelect />} />
            <Route path="/farmer-upload-form" element={<FarmerUploadForm />} />
            <Route path="/product-success" element={<ProductSuccess />} />
            <Route path="/home" element={<CustomerHome />} />
            <Route path="/farmer-profile" element={<FarmerProfile />} />
            <Route path="/see-uploaded-products" element={<SeeUploadedProducts />} />
            <Route path="/category-products" element={<CategoryProducts />} />
          </Routes>
        </Router>
      </CartProvider>
      </WishlistProvider>
    </globalContext.Provider>
  );
};

export default App;
