/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { app } from "@/src/config/FirebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import UserIcon from "@/src/components/icons/UserIcon";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function DropdownProfile() {
  const [user, setUser] = useState<any>(null);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const authInstance = getAuth(app);
    const unsubscribe = authInstance.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      router.push("/");
      toast.custom(
        (t) => (
          <>
            <div className="max-w-xs relative bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700" role="alert" aria-labelledby="hs-toast-avatar-label">
              <div className="flex p-4">
                <div className="shrink-0">
                  {user && user.photoURL ? <Avatar src={user.photoURL} className="size-8 text-large" /> : <UserIcon className="w-8 h-8" />}
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-3 end-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white"
                    aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="ms-4 me-5">
                  <h3 id="hs-toast-avatar-label" className="text-gray-800 font-medium text-sm dark:text-white">
                    <span className="font-semibold">{user.displayName}</span>, Sampai Jumpa Kembali 👋
                  </h3>
                </div>
              </div>
            </div>
          </>
        ),
        {
          duration: 6000,
        }
      );
      await signOut(auth);
    } catch (error: any) {
      console.log("Error signing out: ", error.message);
    }
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <button>{user && user.photoURL ? <Avatar src={user.photoURL} className="w-10 h-10 text-large" /> : <UserIcon className="w-10 h-10" />}</button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user && user.email}</p>
        </DropdownItem>
        <DropdownItem key="dashboard" onClick={() => router.push("/dashboard")}>
          Dashboard
        </DropdownItem>
        <DropdownItem key="signout" className="text-danger" color="danger" onClick={handleLogout}>
          Sign Out
          <span className="ml-2">
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
