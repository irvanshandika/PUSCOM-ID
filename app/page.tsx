import React from "react";
import Navbar from "@/src/components/Navbar";
import Hero from "@/src/sections/Hero";
import SearchSection from "@/src/sections/SearchSection";
import CategoryProducts from "@/src/sections/CategoriesProducts";
import Features from "@/src/sections/Features";
import CallToAction from "@/src/sections/CallToAction";
import Footer from "@/src/components/Footer";
import AIChatModal from "@/src/components/AiChat";

function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Hero />
          <SearchSection />
          <CategoryProducts />
          <Features />
          <CallToAction />
          <AIChatModal />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;
