import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

import { watchAPI } from "../services/api";
import "./Detail.css";

function Detail({ onAddToCart, watches = [] }) {
  const { id } = useParams();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated} = useAuth();

  useEffect(() => {
    fetchWatch();
  }, [id]);

  const fetchWatch = async () => {
    try {
      setLoading(true);
      const data = await watchAPI.getById(id);
      // API returns an array, get first element
      setWatch(Array.isArray(data) ? data[0] : data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch watch:', err);
      setError('Failed to load watch details.');
    } finally {
      setLoading(false);
    }
  };

  async function addToWishlist(watch_id, user_id) {
    const res = await fetch("https://web103-finalproject-gzz2.onrender.com/api/wishlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ watch_id, user_id }),
    });
  
    const data = await res.json();
    console.log("Added to wishlist:", data);
  }
  

  if (loading) {
    return <main className="wg-container">Loading watch details...</main>;
  }

  if (error) {
    return (
      <main className="wg-container">
        <p>{error}</p>
        <button onClick={fetchWatch}>Retry</button>
      </main>
    );
  }

  if (!watch) return <main className="wg-container">Watch not found.</main>;

  // Get related watches (exclude current watch)
  const relatedWatches = watches.filter((w) => w.id !== parseInt(id)).slice(0, 4);

  // Format price if it's a number
  const formattedPrice = typeof watch.price === 'number' 
    ? `$${watch.price.toLocaleString()}` 
    : watch.price;

  return (
    <main className="wg-container wg-detail">
      <div className="wg-detail-grid">
        <div className="wg-detail-image" aria-hidden>
          {watch.image_url && <img src={watch.image_url} alt={watch.name} />}
        </div>
        <div className="wg-detail-info">
          <h2 className="wg-detail-title">{watch.name}</h2>
          <div className="wg-detail-price">{formattedPrice}</div>
          <p className="wg-detail-desc">{watch.description}</p>

          {watch.brand_name && (
            <div className="wg-brand-info">
              <strong>Brand:</strong> {watch.brand_name}
              {watch.logo_url && <img src={watch.logo_url} alt={watch.brand_name} className="brand-logo" />}
            </div>
          )}

          <button className="wg-cta big" onClick={() => onAddToCart(watch.id)}>
            Add to Cart
          </button>
        </div>
      </div>

      {relatedWatches.length > 0 && (
        <section className="wg-related">
          <h3>Related Watches</h3>
          <div className="wg-related-grid">
            {relatedWatches.map((w) => (
              <div key={w.id} className="wg-related-card">
                <div className="wg-image" aria-hidden>
                  {w.image_url && <img src={w.image_url} alt={w.name} />}
                </div>
                <h4>{w.name}</h4>
                <div className="price">
                  {typeof w.price === 'number' ? `$${w.price.toLocaleString()}` : w.price}
                </div>
                <Link className="wg-link" to={`/detail/${w.id}`}>View</Link>
                <button className='wg-link' onClick={() => addToWishlist(w.id, user.id)}>Add to Wishlist</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Detail;
