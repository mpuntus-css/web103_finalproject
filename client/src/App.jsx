import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import { sampleWatches } from "./data/watches";
import "./styles.css";

function App() {
  // Cart now stores objects with id and quantity: { id: number, quantity: number }
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 750);
  };

  const addToCart = (id) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === id);
      if (existingItem) {
        // Increment quantity if item already exists
        return prev.map(item => 
          item.id === id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prev, { id, quantity: 1 }];
      }
    });
    showNotification("Watch has been added to the cart");
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        // Decrement quantity if more than 1
        return prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Remove item completely if quantity is 1
        return prev.filter(item => item.id !== id);
      }
    });
  };

  const addToWishlist = (id) => setWishlist((prev) => [...new Set([...prev, id])]);
  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((x) => x !== id));
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  const wishlistItems = wishlist.map((id) =>
    sampleWatches.find((w) => w.id === id)
  ).filter(Boolean);

  // Map cart items to include watch data and quantity
  const cartItems = cart.map(({ id, quantity }) => {
    const watch = sampleWatches.find((w) => w.id === id);
    return watch ? { ...watch, quantity } : null;
  }).filter(Boolean);

  return (
    <Router>
      <Header />
      {notification && <div className="notification">{notification}</div>}
      <Routes>
        <Route path="/" element={<Home watches={sampleWatches} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} />} />
        <Route path="/detail/:id" element={<Detail onAddToCart={addToCart} />} />
        <Route path="/wishlist" element={<Account wishlist={wishlistItems} onRemove={removeFromWishlist} />} />
        <Route path="/cart" element={<Cart cart={cartItems} onRemove={removeFromCart} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
