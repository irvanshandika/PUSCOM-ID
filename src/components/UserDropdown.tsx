import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import UserIcon from "./icons/UserIcon";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const router = useRouter();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button>
            <UserIcon className="w-10 h-10 text-gray-400" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="signin" onClick={() => router.push("/auth/signin")} endContent={<i className="fa-solid fa-right-to-bracket translate-x-[-6.5vw]"></i>}>
            Sign In
          </DropdownItem>
          <DropdownItem key="signup" onClick={() => router.push("/auth/signup")} endContent={<i className="fa-solid fa-user-plus translate-x-[-6vw]"></i>}>
            Sign Up
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
