import React from "react";
import Navbar from "@/src/components/Navbar";
import Error404Page from "@/src/components/NotFound";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Not Found",
};

function NotFound() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Error404Page />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default NotFound;
