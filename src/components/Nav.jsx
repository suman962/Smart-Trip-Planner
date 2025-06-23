import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@heroui/react";
import { useState } from "react";

const Nav = ({ className = "", currentPage = "Home" }) => { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Search", href: "/search" },
    { name: "Trips", href: "/trips" },
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" }
  ];

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
        <NavbarItem>
          <Link href="/login" className={`text-inherit ${currentPage === "Login" ? "font-semibold text-sky-400" : ""}`}>
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/signup" variant="flat" 
            className={`${currentPage === "Sign Up" ? "text-black bg-inherit border-3 border-sky-700" : "text-white bg-sky-700"}`}
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              color={currentPage === item.name ? "primary" : "foreground"}
              className={`w-full text-white ${currentPage === item.name ? "font-semibold text-sky-400" : ""}`}
              href={item.href}
              size="lg"
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