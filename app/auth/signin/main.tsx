/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Avatar } from "@nextui-org/react";
import { useSignInStore } from "@/src/store/signInStore";
import { GoogleIcon } from "@/src/components/icons/GoogleIcon";
import { toast } from "react-hot-toast";
import Link from "next/link";
import UserIcon from "@/src/components/icons/UserIcon";

const SignInPage: React.FC = () => {
  const router = useRouter();
  
  const { email, password, setEmail, setPassword, signInWithEmail, signInWithGoogle } = useSignInStore();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmail(router);
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(router);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-blue-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-96 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Login ke PUSCOM</h1>
        <p className="text-center text-gray-600 mb-6">Silahkan masuk untuk mengakses layanan kami</p>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input label="Email" placeholder="Masukkan email Anda" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" isRequired required />
          <Input label="Password" placeholder="Masukkan password Anda" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="password" isRequired required />
          <Button type="submit" className="w-full bg-blue-600 text-white rounded-full py-3 font-bold hover:bg-blue-700">
            Masuk
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-500">atau</span>
        </div>
        <Button onClick={handleGoogleSignIn} className="w-full mt-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-full flex justify-center items-center">
          <GoogleIcon className="text-red-500" />
          <span className="ml-2">Masuk dengan Google</span>
        </Button>
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          <Link href="/reset-password" className="text-blue-600 hover:underline">
            Lupa password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
