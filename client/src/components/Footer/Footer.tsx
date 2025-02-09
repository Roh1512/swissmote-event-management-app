import { memo } from "react";
import Logo from "../Logo/Logo";

const Footer = memo(() => {
  return (
    <footer className="w-full">
      <Logo />
      <p>&copy; 2025 All rights reserved.</p>
    </footer>
  );
});

export default Footer;
