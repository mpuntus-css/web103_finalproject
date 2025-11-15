import "./Account.css";

function Account({ wishlist, onRemove }) {
  return (
    <main className="wg-container">
      <section className="wg-wishlist">
        <h2>Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <div className="wg-empty">Your wishlist is empty.</div>
        ) : (
          <div className="wg-grid">
            {wishlist.map((w) => (
              <div key={w.id} className="wg-card">
                <div className="wg-image" aria-hidden></div>
                <h3 className="wg-title">{w.name}</h3>
                <div className="wg-price">{w.price}</div>
                <button className="wg-cta" onClick={() => onRemove(w.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Account;
