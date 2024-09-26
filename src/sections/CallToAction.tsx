"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Siap untuk Meningkatkan Performa Komputer Anda?</h2>
      <p className="text-xl text-gray-600 mb-8">Temukan solusi terbaik untuk kebutuhan komputasi Anda bersama PUSCOM</p>
      <Button color="primary" size="lg" onClick={() => router.push("/catalog")} endContent={<ChevronRight />}>
        Mulai Belanja Sekarang
      </Button>
    </section>
  );
}
