/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "@/src/config/FirebaseConfig";
import { GoogleIcon } from "@/src/components/icons/GoogleIcon";
import { toast } from "react-hot-toast";
import Link from "next/link";

const SignUpPage: React.FC = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const auth = getAuth(app);
  const db = getFirestore(app);

  const checkExistingAccount = async (email: string) => {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0 ? methods[0] : null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existingMethod = await checkExistingAccount(email);
      if (existingMethod) {
        if (existingMethod === "google.com") {
          toast.error(`Maaf, email ${email} sudah terdaftar dengan Google. Silakan gunakan metode Sign In dengan Google.`);
        } else {
          toast.error(`Maaf, email ${email} sudah terdaftar. Jika anda lupa kata sandi bisa langsung melakukan ganti kata sandi akun anda`);
        }
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const defaultPhotoURL = "https://example.com/default-avatar.png";

      await updateProfile(user, {
        displayName: displayName,
        photoURL: defaultPhotoURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        photoURL: defaultPhotoURL,
        uid: user.uid,
        accountType: "customer",
        signType: "credential",
      });

      toast.success("Selamat! Anda berhasil mendaftar.");
      router.push("/");
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Periksa apakah pengguna sudah ada di Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // Jika pengguna belum ada, tambahkan ke Firestore
        await setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL || "https://example.com/default-avatar.png",
          uid: user.uid,
          accountType: "customer",
          signType: "google",
        });
        toast.success("Selamat! Anda berhasil mendaftar dengan Google.");
      } else {
        toast.success("Anda berhasil masuk dengan Google.");
      }

      router.push("/");
    } catch (error) {
      console.error("Error during Google sign up:", error);
      toast.error("Terjadi kesalahan saat mendaftar dengan Google. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-blue-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-96 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Daftar Akun PUSCOM</h1>
        <p className="text-center text-gray-600 mb-6">Silahkan daftar untuk membeli, menjual, atau memperbaiki perangkat komputer Anda</p>
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input label="Full Name" placeholder="Masukkan email Anda" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <Input label="Email" placeholder="Masukkan email Anda" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" placeholder="Masukkan password Anda" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full bg-blue-600 text-white rounded-full py-3 font-bold hover:bg-blue-700">
            Daftar Sekarang
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-500">atau</span>
        </div>
        <Button onClick={handleGoogleSignUp} className="w-full mt-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-full flex justify-center items-center">
          <GoogleIcon className="text-red-500" />
          <span className="ml-2">Daftar dengan Google</span>
        </Button>
        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
