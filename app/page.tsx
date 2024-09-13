import React from "react";
import Navbar from "@/src/components/Navbar";
import Hero from "@/src/sections/Hero";
import Services from "@/src/sections/Services";
import Testimonials from "@/src/sections/Testimonials";
import Contact from "@/src/sections/Contact";
import Footer from "@/src/components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
