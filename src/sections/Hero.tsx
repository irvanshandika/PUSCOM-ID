"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="text-center mb-16">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Solusi Komputer Terbaik untuk Anda</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Temukan perangkat keras dan aksesoris berkualitas tinggi untuk kebutuhan komputasi Anda</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button color="primary" onClick={() => router.push("/catalog")} size="lg" endContent={<ChevronRight />}>
          Jelajahi Produk
        </Button>
        <Button variant="bordered" size="lg">
          Konsultasi Gratis
        </Button>
      </div>
    </section>
  );
}
