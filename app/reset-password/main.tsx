"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link } from "@nextui-org/react";
import { Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/config/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Jika berhasil
      setSuccess(true);
    } catch (err) {
      toast.error("Gagal mengirim email reset password. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen from-gray-100 to-blue-100 bg-gradient-to-r">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4">Email Terkirim</h2>
            <p className="mb-4">Instruksi untuk mereset password telah dikirim ke alamat email Anda. Silakan periksa kotak masuk Anda dan ikuti petunjuk yang diberikan.</p>
            <Button color="primary" variant="flat" onPress={() => router.push("/auth/signin")}>
              Kembali ke Halaman Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen from-gray-100 to-blue-100 bg-gradient-to-r">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-small text-default-500">Masukkan alamat email Anda untuk menerima link reset password</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input label="Email" placeholder="Masukkan alamat email Anda" type="email" value={email} onChange={(e) => setEmail(e.target.value)} startContent={<Mail className="text-default-400" size={20} />} autoComplete="email" isRequired required />
            {error && <p className="text-danger text-small">{error}</p>}
            <Button type="submit" color="primary" className="w-full" isLoading={isLoading}>
              Kirim Link Reset Password
            </Button>
          </form>
        </CardBody>
        <CardFooter className="flex flex-col items-center">
          <Link href="/auth/signin" className="text-small flex items-center text-primary">
            <ArrowLeft size={16} className="mr-1" />
            Kembali ke Halaman Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}