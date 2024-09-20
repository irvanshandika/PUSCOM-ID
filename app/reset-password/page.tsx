import React from "react";
import ForgotPasswordPage from "./main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

function ForgotPassword() {
  return (
    <>
      <ForgotPasswordPage />
    </>
  );
}

export default ForgotPassword;
