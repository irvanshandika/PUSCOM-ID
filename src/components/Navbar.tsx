"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserDropdown from "@/src/components/UserDropdown";
import DropdownUser from "@/src/servercomponents/UserLogin/DropdownUser";
import { auth, db } from "@/src/config/FirebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation"; // Import usePathname

function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserExists, setIsUserExists] = useState(false);
  const pathname = usePathname(); // Initialize usePathname

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
    <>
      <header className="flex fixed z-20 top-0 start-0 flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-3 bg-transparent backdrop-blur-lg">
        <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
          <Link className="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80" href="/">
            PUSCOM
          </Link>
          <div className="sm:order-3 flex items-center gap-x-2">
            {user && isUserExists ? (
              <>
                <DropdownUser />
              </>
            ) : (
              <>
                <UserDropdown />
              </>
            )}
            <button
              type="button"
              className="sm:hidden hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
              id="hs-navbar-alignment-collapse"
              aria-expanded="false"
              aria-controls="hs-navbar-alignment"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-navbar-alignment">
              <svg
                className="hs-collapse-open:hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Toggle</span>
            </button>
          </div>
          <div id="hs-navbar-alignment" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:grow-0 sm:basis-auto sm:block sm:order-2" aria-labelledby="hs-navbar-alignment-collapse">
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5">
              <Link href="/" className={`font-medium focus:outline-none ${isActive("/") ? "text-blue-500" : "text-inherit hover:text-gray-400"}`}>
                Home
              </Link>
              <Link href="/catalog" className={`font-medium focus:outline-none ${isActive("/catalog") ? "text-blue-500" : "text-inherit hover:text-gray-400"}`}>
                Catalog
              </Link>
              <Link href="/service" className={`font-medium focus:outline-none ${isActive("/service") ? "text-blue-500" : "text-inherit hover:text-gray-400"}`}>
                Service
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
