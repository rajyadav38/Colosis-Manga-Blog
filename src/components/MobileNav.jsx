import { Link, useLocation } from "react-router-dom";
import {
  House,
  PlusSquare,
  Compass,
  ChatDots,
  Person,
} from "react-bootstrap-icons";

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: <House />, label: "Home" },
    { to: "/create", icon: <PlusSquare />, label: "Create" },
    { to: "/scrolls", icon: <Compass />, label: "Scrolls" },
    { to: "/chat", icon: <ChatDots />, label: "Chat" },
    { to: "/profile", icon: <Person />, label: "Profile" },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`mobile-nav-item ${
            location.pathname === item.to ? "active" : ""
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
