import { memo } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../themeComponents/ToggleTheme";

const Header = memo(() => {
  return (
    <header className="navbar">
      <div className="flex-1">
        <Link to="/" className="btn btn-neutral">
          Home
        </Link>
      </div>
      {/* Shop Now Button */}
      <div className="flex-none gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
});

export default Header;
