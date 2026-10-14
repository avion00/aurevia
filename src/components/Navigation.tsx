import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { brand } from "@/data/brand";

const links = [
  { to: "/properties", label: "Properties" },
  { to: "/locations", label: "Locations" },
  { to: "/developers", label: "Developers" },
  { to: "/services", label: "Our approach" },
  { to: "/about", label: "About" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setIsOpen(false);

  return (
    <header className={`site-header${pathname === "/" ? "" : " site-header-light"}`}>
      <div className="header-inner">
        <Link to="/" className="brand-lockup" aria-label={`${brand.name} home`} onClick={close}>
          <span className="brand-mark" aria-hidden="true">A</span>
          <span className="brand-wordmark">
            <strong>{brand.logoText}</strong>
            <small>Dubai · United Arab Emirates</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="header-cta">
          Speak with an advisor <ArrowUpRight size={15} aria-hidden="true" />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {isOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={close}
              className={pathname === link.to ? "active" : ""}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" onClick={close}>Speak with an advisor <ArrowUpRight size={16} /></Link>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
