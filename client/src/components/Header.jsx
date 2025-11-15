import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="wg-header">
      <div className="wg-logo">
        <Link to="/"> TIMELESS LUXE </Link>
      </div>
      <nav className="wg-nav">
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  );
};

export default Header;
