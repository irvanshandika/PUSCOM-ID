import React from "react";
import Sidebar from "@/src/components/Sidebar";
import DaftarServisPage from "./main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Servis",
};

function Dashboard() {
  return (
    <>
      <Sidebar>
        <DaftarServisPage />
      </Sidebar>
    </>
  );
}

export default Dashboard;
