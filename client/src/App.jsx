import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Account from "./pages/Account";
import { sampleWatches } from "./data/watches";
import "./styles.css";

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (id) => setCart((prev) => [...prev, id]);
  const addToWishlist = (id) => setWishlist((prev) => [...new Set([...prev, id])]);
  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((x) => x !== id));

  const wishlistItems = wishlist.map((id) =>
    sampleWatches.find((w) => w.id === id)
  ).filter(Boolean);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home watches={sampleWatches} onAddToCart={addToCart} onSaveWishlist={addToWishlist} />} />
        <Route path="/detail/:id" element={<Detail onAddToCart={addToCart} />} />
        <Route path="/wishlist" element={<Account wishlist={wishlistItems} onRemove={removeFromWishlist} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
