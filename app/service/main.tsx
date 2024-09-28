/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import ServisForm from "@/src/servercomponents/Servis/ServisForm";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/src/config/FirebaseConfig";
import Image from "next/image";

function ServisPage() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");

  const auth = getAuth(app);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || ""); // Pre-fill the email if available
      } else {
        setUser(null);
      }
      setLoadingAuth(false); // Set loading to false after auth check
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  if (loadingAuth) {
    // Show a loading message while waiting for auth state
    return <div className="flex items-center text-2xl font-semibold justify-center py-[25vh]">Memuat...</div>;
  }

  if (!user) {
    // If user is not authenticated, show sign-in prompt
    return (
      <>
        <div className="flex flex-col items-center justify-center py-4 sm:px-8">
          <Image
            src="https://cdn3d.iconscout.com/3d/premium/thumb/403-forbidden-error-3d-icon-download-in-png-blend-fbx-gltf-file-formats--status-code-http-response-pack-seo-web-icons-5073043.png?f=webp"
            width={0}
            height={0}
            alt="Login"
            className="w-[300px]"
          />
          <h2 className="text-2xl font-semibold mb-4 text-center max-w-xl">Anda harus masuk terlebih dahulu untuk mengakses halaman ini demi keamanan data Anda.</h2>
          <Button onPress={() => router.push("/auth/signin")} color="primary" className="w-full sm:w-auto">
            Masuk
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <ServisForm />
    </>
  );
}

export default ServisPage;
