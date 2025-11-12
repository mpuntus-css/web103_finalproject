import { Link } from "react-router-dom";

export default function Home({ watches, onAddToCart, onSaveWishlist }) {
  return (
    <main className="wg-container">
      <section className="wg-hero">
        <h1>Watches</h1>
      </section>

      <section className="wg-grid">
        {watches.map((w) => (
          <article key={w.id} className="wg-card">
            <div className="wg-image" aria-hidden></div>
            <h3 className="wg-title">{w.name}</h3>
            <div className="wg-price">{w.price}</div>
            <div className="wg-actions">
              <Link className="wg-link" to={`/detail/${w.id}`}>View</Link>
              <button className="wg-cta" onClick={() => onAddToCart(w.id)}>Add to Cart</button>
              <button className="wg-save" onClick={() => onSaveWishlist(w.id)}>♡</button>
            </div>
          </article>
        ))}
      </section>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="wg-cta big" style={{ maxWidth: '300px', margin: '0 auto' }}>
          Shop All
        </button>
      </div>
    </main>
  );
}
