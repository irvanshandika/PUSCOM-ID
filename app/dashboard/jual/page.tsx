import React from "react";
import JualPage from "./main";
import Sidebar from "@/src/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jual Laptop & Komputer",
};

function Jual() {
  return (
    <>
      <Sidebar>
        <JualPage />
      </Sidebar>
    </>
  );
}

export default Jual;
