import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="wg-header">
      <div className="wg-logo">
        <Link to="/">WATCHGUYS</Link>
      </div>
      <nav className="wg-nav">
        <Link to="/">Home</Link>
        <Link to="/account">Account</Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  );
}
