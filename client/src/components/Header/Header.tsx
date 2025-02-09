import { memo } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../themeComponents/ToggleTheme";
import { useCheckAuthQuery } from "@/features/auth/authApiSlice";
import Logo from "../Logo/Logo";

const Header = memo(() => {
  const { isSuccess } = useCheckAuthQuery();

  return (
    <header className="navbar">
      <div className="flex-1">
        <Logo />
      </div>
      {isSuccess ? (
        <div className="flex items-center justify-center gap-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `btn btn-ghost btn-sm ${isActive ? "btn-active" : ""}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/category"
            className={({ isActive }) =>
              `btn btn-ghost btn-sm ${isActive ? "btn-active" : ""}`
            }
          >
            Categories
          </NavLink>
        </div>
      ) : (
        <div className="flex-none gap-2">
          <ThemeToggle />
        </div>
      )}
    </header>
  );
});

export default Header;
