import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { watchAPI } from "./services/api";
import "./styles.css";
import Signup from "./pages/Signup.jsx";
import Reviews from "./pages/Reviews.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { wishlistAPI } from "./services/api";

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


  const API_URL = import.meta.env.PROD ? '{YOUR_SERVER_URL}' : '/api';


  const {user, isAuthenticated} = useAuth();

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
      console.log("WATCHES RESPONSE:", data);

      
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

  async function loadWishlist() {
    if (!user) return;
    try {
      const data = await wishlistAPI.getAll(user.id);
      setWishlist(data);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
  }
  
  async function handleAddToWishlist(watchId) {
    if (!user) {
      alert("Please log in to save items.");
      return;
    }
    try {
      await wishlistAPI.add(user.id, watchId);
      await loadWishlist();  // refresh
    } catch (err) {
      console.error("Failed to add wishlist:", err);
    }
  }
  
  async function handleRemoveWishlist(id) {
    try {
      await wishlistAPI.remove(id);
      await loadWishlist(); // refresh
    } catch (err) {
      console.error("Failed to remove wishlist:", err);
    }
  }

  const handleToggleWishlist = async (watchId) => {
    const currentUser = user;
  
    if (!currentUser) {
      alert("Please log in to save items.");
      return;
    }
  
    const isInWishlist = wishlist.includes(watchId);
  
    // Optimistic UI update
    setWishlist(prev =>
      isInWishlist ? prev.filter(id => id !== watchId) : [...prev, watchId]
    );
  
    try {
      if (isInWishlist) {
        await wishlistAPI.remove(watchId); // remove from DB
      } else {
        await wishlistAPI.add(currentUser.id, watchId); // add to DB
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);
      // revert on failure
      setWishlist(prev =>
        isInWishlist ? [...prev, watchId] : prev.filter(id => id !== watchId)
      );
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
          <Route path="/" element={<Home watches={watches} onAddToCart={addToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onLoadMore={loadMoreWatches} hasMore={hasMore} isLoadingMore={isLoadingMore} />} />
          <Route path="/detail/:id" element={<Detail watches={watches} onAddToCart={addToCart} onAddToWishlist={handleAddToWishlist}/>}/>

          <Route path="/wishlist" element={<Account wishlist={wishlistItems} onRemove={handleRemoveWishlist} />} />
          <Route path="/cart" element={<Cart cart={cartItems} onRemove={removeFromCart} />} />
          <Route path="/login" element={<Login></Login>}/>
          <Route path="/signup" element={<Signup></Signup>}/>
          <Route path="/reviews/:id" element={<Reviews></Reviews>}/>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

