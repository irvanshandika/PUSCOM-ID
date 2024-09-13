import React from "react";
import Navbar from "@/src/components/Navbar";
import ForbiddenPage from "./main";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "505 - Forbidden",
};

function Forbidden() {
  return (
    <>
      <Navbar />
      <ForbiddenPage />
      <Footer />
    </>
  );
}

export default Forbidden;
