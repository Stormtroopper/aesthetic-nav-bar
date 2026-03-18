import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Features", path: "/features" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-nav-border bg-nav/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-accent-foreground">P</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            PDF<span className="text-accent">Extract</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "text-nav-link-active"
                    : "text-nav-link hover:bg-secondary hover:text-nav-link-hover"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-nav-link transition-colors duration-150 hover:text-nav-link-hover"
          >
            Sign In
          </Link>
          <Link
            to="/get-started"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-all duration-150 hover:brightness-110"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-nav-link transition-colors hover:text-foreground md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-nav-border bg-nav px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "text-nav-link-active"
                      : "text-nav-link hover:bg-secondary hover:text-nav-link-hover"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-2 border-t border-nav-border pt-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 text-sm font-medium text-nav-link"
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-accent-foreground"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
