import "./Cart.css";

function Cart({ cart, onRemove }) {
  // Calculate total price accounting for quantity
  const total = cart.reduce((sum, watch) => {
    const price = typeof watch.price === "string"
    ? parseFloat(watch.price.replace(/[^0-9.-]+/g, ""))
    : watch.price;
      return sum + (price * watch.quantity);
  }, 0);

  const handlePurchase = () => {
    alert(`Purchase completed! Total: $${total.toFixed(2)}`);
  };

  return (
    <main className="wg-container">
      <h1 className="wg-page-title">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="wg-empty">Your cart is empty.</div>
      ) : (
        <>
          <div className="wg-grid">
            {cart.map((w) => (
              <div key={w.id} className="wg-card">
                <div className="wg-image" aria-hidden></div>
                <h3 className="wg-title">{w.name}</h3>
                <div className="wg-price">{w.price}</div>
                {w.quantity > 1 && (
                  <div className="wg-quantity">Quantity: {w.quantity}</div>
                )}
                <button className="wg-cta" onClick={() => onRemove(w.id)}>
                  {w.quantity > 1 ? 'Remove One' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
            <button className="wg-cta purchase-btn" onClick={handlePurchase}>
              Purchase
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default Cart;
