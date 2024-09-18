// src/app/products/[id]/page.tsx
import React from "react";
import ProductDetail from "./main";
import { Metadata } from "next";
import { db } from "@/src/config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const docRef = doc(db, "products", params.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const productData = docSnap.data();
    return {
      title: productData.name, // Set the title to product name
    };
  }

  return {
    title: "Produk tidak ditemukan",
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <ProductDetail id={params.id} />
        </main>
        <Footer />
      </div>
    </>
  );
}
