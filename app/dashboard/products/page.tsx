import React from "react";
import Sidebar from "@/src/components/Sidebar";
import ManageProducts from "./main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Produk",
};

function AddProductPage() {
  return (
    <>
      <Sidebar>
        <ManageProducts />
      </Sidebar>
    </>
  );
}

export default AddProductPage;
