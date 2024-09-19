import React from "react";
import Navbar from "@/src/components/Navbar";
import Hero from "@/src/sections/Hero";
import Services from "@/src/sections/Services";
import Testimonials from "@/src/sections/Testimonials";
import Contact from "@/src/sections/Contact";
import Footer from "@/src/components/Footer";
import AIChatModal from "@/src/components/AiChat";

function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Hero />
          <Services />
          <Testimonials />
          <Contact />
          <AIChatModal />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;
