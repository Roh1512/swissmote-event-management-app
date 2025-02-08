import { memo } from "react";
import { Link } from "react-router-dom";

const Footer = memo(() => {
  return (
    <footer className="w-full">
      <Link to="/" className="btn btn-neutral">
        Home
      </Link>
      <p>&copy; 2025 All rights reserved.</p>
    </footer>
  );
});

export default Footer;
