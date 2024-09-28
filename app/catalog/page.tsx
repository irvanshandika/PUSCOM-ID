import React from "react";
import ProductCatalog from "./main";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk",
};

function Catalog() {
  return (
    <>
      <div className="bg-gray-50">
        <Navbar />
        <main>
          <ProductCatalog />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Catalog;
