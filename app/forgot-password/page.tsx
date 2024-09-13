import React from "react";
import ForgotPasswordPage from "./main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | May Beauty Skin",
};

function ForgotPassword() {
  return (
    <>
      <ForgotPasswordPage />
    </>
  );
}

export default ForgotPassword;
