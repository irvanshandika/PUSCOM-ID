/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
import SearchSection from "./SearchSection";

export default function HeroSection() {
  const Logo = [
    {
      src: "https://api.iconify.design/simple-icons:asus.svg",
      alt: "asus-logo",
    },
    {
      src: "https://api.iconify.design/simple-icons:lenovo.svg",
      alt: "lenovo-logo",
    },
    {
      src: "https://api.iconify.design/simple-icons:acer.svg",
      alt: "acer-logo",
    },
    {
      src: "https://api.iconify.design/simple-icons:msibusiness.svg",
      alt: "msi-logo",
    },
  ];
  return (
    <div className="font-[sans-serif] bg-gray-50 px-4 pb-12">
      <div className="text-center max-w-2xl max-md:max-w-md mx-auto">
        <div>
          <h2 className="text-gray-800 md:text-5xl text-3xl font-extrabold mb-4 md:!leading-[55px]">Solusi Komputer Terbaik untuk Anda</h2>
          <p className="mt-6 text-base text-gray-500 leading-relaxed">Temukan perangkat keras dan aksesoris berkualitas tinggi untuk kebutuhan komputasi Anda</p>

          <SearchSection />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center mt-6">
          {Logo.map((logo, index) => (
            <div key={index}>
              <Image src={logo.src} alt={logo.alt} className="w-28 mx-auto" width={0} height={0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
