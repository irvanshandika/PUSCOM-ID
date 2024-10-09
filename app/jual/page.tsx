import React from "react";
import JualPage from "./main";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jual Laptop & Komputer",
};

function Jual() {
  return (
    <>
      <div className="bg-gray-50">
        <Navbar />
        <main>
          <JualPage />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Jual;
