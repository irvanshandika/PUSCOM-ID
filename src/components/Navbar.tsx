/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Link, Button } from "@nextui-org/react";
import { Cpu, ShoppingCart } from "lucide-react";
import UserDropdown from "@/src/components/UserDropdown";
import DropdownUser from "@/src/servercomponents/UserLogin/DropdownUser";
import { auth, db } from "@/src/config/FirebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

export default function TechHubNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserExists, setIsUserExists] = useState(false);
  const pathname = usePathname(); // Initialize usePathname

  const menuItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Katalog",
      href: "/catalog",
    },
    {
      label: "Services",
      href: "/service",
    },
    {
      label: "Kontak",
      href: "/contact",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        setIsUserExists(userDoc.exists());
      } else {
        setIsUserExists(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to check if the link is active
  const isActive = (path: string) => pathname === path;

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
        <NavbarBrand>
          <Link href="/">
            <Cpu className="text-primary" />
            <p className="font-bold text-inherit">PUSCOM</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item}-${index}`}>
            <Link
              color="foreground"
              className={`font-medium focus:outline-none ${isActive(`${item.href}`) ? "underline underline-offset-4 decoration-blue-500 decoration-solid" : "text-inherit hover:text-gray-400"}`}
              href={item.href}
              aria-label={`${item.label}`}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {user && isUserExists ? (
            <>
              <DropdownUser />
            </>
          ) : (
            <>
              <UserDropdown />
            </>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color="foreground"
              className={`font-medium focus:outline-none w-full ${isActive(`${item.href}`) ? "underline underline-offset-4 decoration-blue-500 decoration-solid" : "text-inherit hover:text-gray-400"}`}
              href={item.href}
              size="lg"
              aria-label={`${item.label}`}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
