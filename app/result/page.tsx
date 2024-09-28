import React, { Suspense } from "react";
import ResultPage from "./main";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

function Result() {
  return (
    <>
      <div className="bg-gray-50">
        <Navbar />
        <main>
          <Suspense>
            <ResultPage />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Result;
