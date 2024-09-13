import React from "react";
import Sidebar from "@/src/components/Sidebar";
import DashboardPage from "./main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

function Dashboard() {
  return (
    <>
      <Sidebar>
        <DashboardPage />
      </Sidebar>
    </>
  );
}

export default Dashboard;
