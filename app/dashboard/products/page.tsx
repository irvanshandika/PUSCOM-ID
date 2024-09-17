import React from "react";
import Sidebar from "@/src/components/Sidebar";
import AddProductPagePage from "./main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Produk",
};

function AddProductPage() {
  return (
    <>
      <Sidebar>
        <AddProductPagePage />
      </Sidebar>
    </>
  );
}

export default AddProductPage;
