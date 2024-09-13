"use client";
import React, { useState } from "react";
import { Input, Button, Spacer } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/src/config/FirebaseConfig"; // Import konfigurasi Firebase Anda
import Image from "next/image";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Link reset password berhasil dikirim ke email Anda!");
    } catch (error) {
      toast.error("Gagal mengirim email reset password. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-pink-600">Reset Password</h2>

        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image src="https://res.cloudinary.com/dszhlpm81/image/upload/v1709444372/assets/phKFNpB7tMHUeEMuMCiMoTyH4rJTs3vp/favicon_phha7v.ico" alt="Logo" className="w-[10rem] h-[10rem]" width={0} height={0} />
          </Link>
        </div>

        <p className="mb-6 text-center text-gray-600">Masukkan email Anda untuk menerima link reset password.</p>

        <Input fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-6" />

        <Button onPress={handleResetPassword} disabled={loading} className="w-full bg-pink-500 text-white hover:bg-pink-600">
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </Button>

        <Spacer y={2} />

        <p className="text-center text-gray-500">
          Kembali ke halaman{" "}
          <a href="/auth/signin" className="text-pink-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;