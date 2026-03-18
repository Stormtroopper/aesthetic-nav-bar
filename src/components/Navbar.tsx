import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Features", path: "/features" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

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

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavigationMenuItem key={link.path}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={link.path}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
                        isActive
                          ? "text-nav-link-active"
                          : "text-nav-link hover:bg-secondary hover:text-nav-link-hover"
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild className="text-nav-link hover:text-nav-link-hover hover:bg-transparent">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-nav-link hover:text-foreground md:hidden">
              <Menu size={22} />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="border-nav-border bg-nav">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "text-nav-link-active"
                        : "text-nav-link hover:bg-secondary hover:text-nav-link-hover"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Separator className="my-3 bg-nav-border" />
              <Button variant="ghost" asChild className="justify-start text-nav-link hover:text-nav-link-hover hover:bg-transparent">
                <Link to="/login" onClick={() => setSheetOpen(false)}>Sign In</Link>
              </Button>
              <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/get-started" onClick={() => setSheetOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
