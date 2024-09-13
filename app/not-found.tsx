import Image from "next/image";
import React from "react";
import Navbar from "@/src/components/Navbar";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Not Found",
};

function NotFound() {
  return (
    <>
      <Navbar />
      <section className="bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("https://res.cloudinary.com/dszhlpm81/image/upload/v1717653450/assets/phKFNpB7tMHUeEMuMCiMoTyH4rJTs3vp/Ellipse_23_nwdmxi.png")' }}>
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <Image
              src="https://cdn3d.iconscout.com/3d/premium/thumb/404-not-found-3d-icon-download-in-png-blend-fbx-gltf-file-formats--web-empty-state-pack-seo-icons-8403172.png?f=webp"
              alt="Illustration"
              className="mx-auto mb-8 inline-block h-56 w-56 flex-none object-cover"
              width={0}
              height={0}
            />
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">404 Error</h1>
            <p className="mx-auto mb-5 max-w-lg text-sm text-gray-500 sm:text-base md:mb-6 lg:mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link href="/" className="inline-block items-center rounded-md bg-black px-8 py-4 text-center font-semibold text-white">
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;