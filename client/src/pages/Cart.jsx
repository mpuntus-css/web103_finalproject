import "./Cart.css";

function Cart({ cart, onRemove }) {
  return (
    <main className="wg-container">
      <h1 className="wg-page-title">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="wg-empty">Your cart is empty.</div>
      ) : (
        <div className="wg-grid">
          {cart.map((w) => (
            <div key={w.id} className="wg-card">
              <div className="wg-image" aria-hidden></div>
              <h3 className="wg-title">{w.name}</h3>
              <div className="wg-price">{w.price}</div>
              <button className="wg-cta" onClick={() => onRemove(w.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Cart;
