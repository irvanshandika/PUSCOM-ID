import React from "react";
import UserDashboard from "./main";
import Sidebar from "@/src/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Users",
};

function Users() {
  return (
    <>
      <Sidebar>
        <UserDashboard />
      </Sidebar>
    </>
  );
}

export default Users;
