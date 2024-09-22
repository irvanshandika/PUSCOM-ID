import React from "react";
import MailPage from "./main";
import Sidebar from "@/src/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mail",
};

function Mail() {
  return (
    <>
      <Sidebar>
        <MailPage />
      </Sidebar>
    </>
  );
}

export default Mail;
