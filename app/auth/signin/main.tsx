/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Avatar } from "@nextui-org/react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/src/config/FirebaseConfig";
import { GoogleIcon } from "@/src/components/icons/GoogleIcon";
import { toast } from "react-hot-toast";
import Link from "next/link";
import UserIcon from "@/src/components/icons/UserIcon";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const auth = getAuth(app);
  const db = getFirestore(app);

  const checkUserInDatabase = async (uid: string): Promise<{ exists: boolean; displayName?: string; signType?: string }> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { exists: true, displayName: userData.displayName, signType: userData.signType };
    }
    return { exists: false };
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const { exists, displayName, signType } = await checkUserInDatabase(user.uid);

      if (!exists) {
        await auth.signOut(); // Sign out the user if they don't exist in the database
        toast.error(`Maaf, akun ${email} belum terdaftar.`);
        return;
      }

      if (signType !== "credential") {
        await auth.signOut();
        toast.error("Akun ini terdaftar dengan metode lain. Silakan gunakan metode sign in yang sesuai.");
        return;
      }

      // toast.success(`Selamat Datang Kembali ${displayName}`);
      toast.custom(
        (t) => (
          <>
            <div className="max-w-xs relative bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700" role="alert" aria-labelledby="hs-toast-avatar-label">
              <div className="flex p-4">
                <div className="shrink-0">
                  {user && user.photoURL ? <Avatar src={user.photoURL} className="size-8 text-large" /> : <UserIcon className="w-8 h-8" />}
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-3 end-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white"
                    aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="ms-4 me-5">
                  <h3 id="hs-toast-avatar-label" className="text-gray-800 font-medium text-sm dark:text-white">
                    <span className="font-semibold">{user.displayName}</span>, Selamat Datang Kembali!
                  </h3>
                </div>
              </div>
            </div>
          </>
        ),
        {
          duration: 6000,
        }
      );
      router.push("/");
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error("Email atau password salah. Silakan coba lagi.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const { exists, displayName, signType } = await checkUserInDatabase(user.uid);

      if (!exists) {
        await auth.signOut(); // Sign out the user if they don't exist in the database
        toast.error(`Maaf, akun ${user.email} belum terdaftar.`);
        return;
      }

      if (signType !== "google") {
        await auth.signOut();
        toast.error("Akun ini terdaftar dengan metode lain. Silakan gunakan metode sign in yang sesuai.");
        return;
      }

      // toast.success(`Selamat Datang Kembali ${displayName}`);
      toast.custom(
        (t) => (
          <>
            <div className="max-w-xs relative bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700" role="alert" aria-labelledby="hs-toast-avatar-label">
              <div className="flex p-4">
                <div className="shrink-0">
                  {user && user.photoURL ? <Avatar src={user.photoURL} className="size-8 text-large" /> : <UserIcon className="w-8 h-8" />}
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-3 end-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white"
                    aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="ms-4 me-5">
                  <h3 id="hs-toast-avatar-label" className="text-gray-800 font-medium text-sm dark:text-white">
                    <span className="font-semibold">{user.displayName}</span>, Selamat Datang Kembali!
                  </h3>
                </div>
              </div>
            </div>
          </>
        ),
        {
          duration: 6000,
        }
      );
      router.push("/");
    } catch (error) {
      console.error("Error during Google sign in:", error);
      toast.error("Terjadi kesalahan saat masuk dengan Google. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
      <div className="p-8 bg-white rounded-lg shadow-xl w-96 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">Selamat Datang Kembali</h1>
        <p className="text-center text-gray-600 mb-6">Masuk untuk melanjutkan perjalanan kecantikan Anda</p>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input label="Email" placeholder="Masukkan email Anda" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full" />
          <Input label="Password" placeholder="Masukkan password Anda" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-full" />
          <Button type="submit" color="secondary" className="w-full rounded-full">
            Masuk
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-500">atau</span>
        </div>
        <Button onClick={handleGoogleSignIn} className="w-full mt-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-full" startContent={<GoogleIcon className="text-red-500" />}>
          Masuk dengan Google
        </Button>
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/auth/signup" className="text-purple-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          <Link href="/forgot-password" className="text-purple-600 hover:underline">
            Lupa password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;