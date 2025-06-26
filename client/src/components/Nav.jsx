import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@heroui/react";
import { useEffect, useState } from "react";

const Nav = ({ className = "", currentPage = "Home" }) => { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [LoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token || !expiry || new Date(expiry) < new Date()) {
      localStorage.removeItem('token'); 
      localStorage.removeItem('expiry');
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  const menuItems = LoggedIn ? [
    { name: "Home", href: "/" },
    { name: "Search", href: "/search" },
    { name: "Trips", href: "/trips" },
    { name: "Log out", href: "/", isLogout: true }
  ] : [
    { name: "Home", href: "/" },
    { name: "Search", href: "/search" },  
    { name: "Trips", href: "/trips" },
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    setLoggedIn(false);
    setIsMenuOpen(false); //close menu after logout
  };

  const navBarClass = (
    className.includes('bg-') ? className
      : `bg-white/10 backdrop-blur-md ${className} text-white`   
  ) + ` shadow-sm`;

  const getNavItemProps = (item) => ({
    color: currentPage === item.name ? "primary" : "foreground",
    className: `text-inherit ${currentPage === item.name ? "font-semibold text-sky-400" : ""}`
  });
  
  return (
    <Navbar 
        onMenuOpenChange={setIsMenuOpen} 
        isBordered
        className={navBarClass}
        classNames={{
          menu: "bg-white/10 backdrop-blur-md"
        }}
      >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img src="./logo.png" alt="Logo" className="size-8 mr-2" />
          <p className="font-bold text-inherit">Smart Trip Planner</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.slice(0, 3).map((item) => (
          <NavbarItem key={item.name}>
            <Link href={item.href} {...getNavItemProps(item)}>
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="hidden sm:flex">
        {LoggedIn ? (
          <NavbarItem>
            <Button
              color="primary"
              className="bg-sky-500 hover:bg-sky-600 text-white"
              onPress={handleLogout}
            >
              Logout
            </Button>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <Link href="/login" className={`text-inherit ${currentPage === "Login" ? "font-semibold text-sky-400" : ""}`}>
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat" 
                className={`${currentPage === "Sign Up" ? "text-sky-400 font-semibold bg-inherit border-2 border-sky-400" : "text-white bg-sky-700"}`}
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              color={currentPage === item.name ? "primary" : "foreground"}
              className={`w-full text-white ${currentPage === item.name ? "font-semibold text-sky-400" : ""}`}
              href={item.href}
              size="lg"
              onPress={item.isLogout ? handleLogout : undefined}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default Nav;