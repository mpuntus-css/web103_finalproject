import "./Account.css";

import { useEffect } from "react";
import { wishlistAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function Account({ wishlist, setWishlist, onRemove }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    const data = await wishlistAPI.getAll(user.id);
    setWishlist(data);
  };

  return (
    <main className="wg-container">
      <h1 className="wg-page-title">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="wg-empty">Your wishlist is empty.</div>
      ) : (
        <div className="wg-grid">
          {wishlist.map((w) => (
            <div key={w.id} className="wg-card">
              <div className="wg-image" aria-hidden></div>
              <h3 className="wg-title">{w.name}</h3>
              <div className="wg-price">{w.price}</div>
              <button className="wg-cta" onClick={() => onRemove(w.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Account;
