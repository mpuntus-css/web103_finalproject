import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import { AuthProvider } from "./context/AuthContext";
import { watchAPI } from "./services/api";
import "./styles.css";

function App() {
  // Cart now stores objects with id and quantity: { id: number, quantity: number }
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async (append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const offset = append ? watches.length : 0;
      const data = await watchAPI.getAll(20, offset);
      
      if (append) {
        setWatches(prev => [...prev, ...data.watches]);
      } else {
        setWatches(data.watches);
      }
      
      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch watches:', err);
      setError('Failed to load watches. Please try again later.');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreWatches = () => {
    if (!isLoadingMore && hasMore) {
      fetchWatches(true);
    }
  };

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
    watches.find((w) => w.id === id)
  ).filter(Boolean);

  // Map cart items to include watch data and quantity
  const cartItems = cart.map(({ id, quantity }) => {
    const watch = watches.find((w) => w.id === id);
    return watch ? { ...watch, quantity } : null;
  }).filter(Boolean);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading watches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchWatches}>Retry</button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Header />
        {notification && <div className="notification">{notification}</div>}
        <Routes>
          <Route path="/" element={<Home watches={watches} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} onLoadMore={loadMoreWatches} hasMore={hasMore} isLoadingMore={isLoadingMore} />} />
          <Route path="/detail/:id" element={<Detail watches={watches} onAddToCart={addToCart} />} />
          <Route path="/wishlist" element={<Account wishlist={wishlistItems} onRemove={removeFromWishlist} />} />
          <Route path="/cart" element={<Cart cart={cartItems} onRemove={removeFromCart} />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
