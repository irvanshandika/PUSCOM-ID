import React from "react";
import ContactPage from "./main";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak",
};

function Contact() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <ContactPage />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Contact;