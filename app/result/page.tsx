import React from "react";
import ResultPage from "./main";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

function Result() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <ResultPage />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Result;
