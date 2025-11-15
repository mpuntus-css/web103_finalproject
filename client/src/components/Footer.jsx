import "./Footer.css";

function Footer() {
  return (
    <footer className="wg-footer">
      <div>
        <a href="#">CONTACT</a>
        <span> · </span>
        <a href="#" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
        <span> · </span>
        <a href="#" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
      </div>
      <div>© {new Date().getFullYear()} TIMELESS LUXE</div>
    </footer>
  );
};

export default Footer;