import React from "react";
import ServisPage from "./main";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servis Laptop & Komputer",
};

function Servis() {
  return (
    <>
      <div className="bg-gray-50">
        <Navbar />
        <main>
          <ServisPage />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Servis;
