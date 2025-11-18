import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  return (
    <header className="wg-header">
      <div className="wg-logo">
        <Link to="/"> TIMELESS LUXE </Link>
      </div>
      <nav className="wg-nav">
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart</Link>
        {!loading && (
          <>
            {isAuthenticated ? (
              <div className="user-section">
                <span className="user-name">Hello, {user?.name}</span>
                <button onClick={logout} className="auth-button">Logout</button>
              </div>
            ) : (
              <button onClick={login} className="auth-button">Login with GitHub</button>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
