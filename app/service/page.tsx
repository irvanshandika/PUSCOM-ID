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
        <main className="container mx-auto px-4 py-12">
          <ServisPage />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Servis;
