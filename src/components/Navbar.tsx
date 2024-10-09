/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import UserDropdown from "@/src/components/UserDropdown";
import DropdownUser from "@/src/servercomponents/UserLogin/DropdownUser";
import { auth, db } from "@/src/config/FirebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [navIsOpened, setNavIsOpened] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserExists, setIsUserExists] = useState(false);
  const pathname = usePathname();

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
      label: "Jual",
      href: "/jual",
    },
    {
      label: "Kontak",
      href: "/contact",
    },
  ];

  const closeNavbar = () => {
    setNavIsOpened(false);
  };

  const toggleNavbar = () => {
    setNavIsOpened((navIsOpened) => !navIsOpened);
  };

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

  const isActive = (path: string) => pathname === path;
  return (
    <>
      <div
        aria-hidden={true}
        onClick={() => {
          closeNavbar();
        }}
        className={`fixed bg-gray-800/40 inset-0 z-30 ${navIsOpened ? "lg:hidden" : "hidden lg:hidden"}`}
      />
      <header className="sticky top-0 w-full flex items-center h-20 border-b border-b-gray-100 dark:border-b-gray-900 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-filter backdrop-blur-xl">
        <nav className="relative mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 flex gap-x-5 justify-between items-center">
          <div className="flex items-center min-w-max">
            <Link href="/" className="relative flex items-center gap-2.5">
              <span aria-hidden={true} className="flex">
                <span className="w-3 h-6 rounded-l-full flex bg-blue-400" />
                <span className="w-3 h-6 rounded-r-full flex bg-indigo-600 mt-2" />
              </span>
              <span className="inline-flex text-lg font-bold text-indigo-950 dark:text-white">PUSCOM</span>
            </Link>
          </div>
          <div
            className={`
        absolute top-full left-0 bg-white dark:bg-gray-950 lg:bg-transparent border-b border-gray-200 dark:border-gray-800 py-8 lg:py-0 px-5 sm:px-10 md:px-12 lg:px-0 lg:border-none w-full lg:top-0 lg:relative lg:w-max lg:flex lg:transition-none duration-300 ease-linear gap-x-6
        ${navIsOpened ? "visible opacity-100 translate-y-0" : "translate-y-10 opacity-0 invisible lg:visible lg:translate-y-0 lg:opacity-100"}
        `}>
            <ul className="flex flex-col lg:flex-row gap-6 lg:items-center text-gray-700 dark:text-gray-300 lg:w-full lg:justify-center">
              {menuItems.map((item, index) => (
                <li key={index} className="text-lg font-medium">
                  <Link
                    href={item.href}
                    className={`relative py-2.5 duration-300 ease-linear ${
                      isActive(`${item.href}`)
                        ? "text-indigo-600 after:absolute after:w-full after:left-0 after:bottom-0 after:h-px after:rounded-md after:origin-left after:ease-linear after:duration-300 after:scale-x-100  after:bg-indigo-600"
                        : "hover:text-indigo-600 after:absolute after:w-full after:left-0 after:bottom-0 after:h-px after:rounded-md after:origin-left after:ease-linear after:duration-300 after:scale-x-0 hover:after:scale-x-100 after:bg-indigo-600"
                    } `}
                    aria-label={item.label}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4  lg:min-w-max mt-10 lg:mt-0">
              {user ? (
                <>
                  <DropdownUser />
                </>
              ) : (
                <>
                  <UserDropdown />
                </>
              )}
            </div>
          </div>
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => {
                toggleNavbar();
              }}
              aria-label="toggle navbar"
              className="outline-none border-l border-l-indigo-100 dark:border-l-gray-800 pl-3 relative py-3">
              <span
                aria-hidden={true}
                className={`
            flex h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
            ${navIsOpened ? "rotate-45 translate-y-[.324rem]" : ""}
        `}></span>
              <span
                aria-hidden={true}
                className={`
            mt-2 flex h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
            ${navIsOpened ? "-rotate-45 -translate-y-[.324rem]" : ""}
            `}
              />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};
export default Navbar;
