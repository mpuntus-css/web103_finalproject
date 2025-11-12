import { useParams } from "react-router-dom";
import { sampleWatches } from "../data/watches";

export default function Detail({ onAddToCart }) {
  const { id } = useParams();
  const watch = sampleWatches.find((w) => w.id === id);

  if (!watch) return <main className="wg-container">Watch not found.</main>;

  // Get related watches (exclude current watch)
  const relatedWatches = sampleWatches.filter((w) => w.id !== id).slice(0, 4);

  return (
    <main className="wg-container wg-detail">
      <div className="wg-detail-grid">
        <div className="wg-detail-image" aria-hidden></div>
        <div className="wg-detail-info">
          <h2 className="wg-detail-title">{watch.name}</h2>
          <div className="wg-detail-price">{watch.price}</div>
          <p className="wg-detail-desc">{watch.short}</p>

          <table className="wg-specs">
            <tbody>
              <tr><th>Material:</th><td>Stainless Steel</td></tr>
              <tr><th>Note:</th><td>Automatic</td></tr>
              <tr><th>Size: 42mm</th><td>100m</td></tr>
              <tr><th>Water Resistance:</th><td>Sapphire</td></tr>
              <tr><th>Crystal:</th><td>Brown Leather</td></tr>
            </tbody>
          </table>

          <button className="wg-cta big" onClick={() => onAddToCart(watch.id)}>
            Add to Cart
          </button>
        </div>
      </div>

      <section className="wg-related">
        <h3>Related Watches</h3>
        <div className="wg-related-grid">
          {relatedWatches.map((w) => (
            <div key={w.id} className="wg-related-card">
              <div className="wg-image" aria-hidden></div>
              <h4>{w.name}</h4>
              <div className="price">{w.price}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
