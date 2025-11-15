import { Link } from "react-router-dom";
import "./Home.css";

function Home({ watches, onAddToCart, onToggleWishlist, wishlist = [] }) {
  return (
    <main className="wg-container">
      <section className="wg-hero">
        <h1>Watches</h1>
      </section>

      <section className="wg-grid">
        {watches.map((w) => {
          const isInWishlist = wishlist.includes(w.id);
          return (
            <article key={w.id} className="wg-card">
              <div className="wg-image" aria-hidden></div>
              <h3 className="wg-title">{w.name}</h3>
              <div className="wg-price">{w.price}</div>
              <div className="wg-actions">
                <Link className="wg-link" to={`/detail/${w.id}`}>View</Link>
                <button className="wg-cta" onClick={() => onAddToCart(w.id)}>Add to Cart</button>
                <button 
                  className={`wg-save ${isInWishlist ? 'in-wishlist' : ''}`} 
                  onClick={() => onToggleWishlist(w.id)}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isInWishlist ? '♥' : '♡'}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <div className="wg-shop-all-container">
        <button className="wg-cta big">Shop All</button>
      </div>
    </main>
  );
};

export default Home;
