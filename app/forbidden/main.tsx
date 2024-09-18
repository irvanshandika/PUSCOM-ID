'use client'
import React from "react";
import { Button } from "@nextui-org/react";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error403Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col justify-center items-center px-4">
      <ShieldAlert className="w-24 h-24 text-red-500 mb-8" />
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 text-center">403 Akses Ditolak</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          as={Link}
          href="/"
          color="primary"
          variant="solid"
          startContent={<Home className="w-4 h-4" />}
        >
          Kembali ke Beranda
        </Button>
        <Button
          as={Link}
          href="#"
          color="default"
          variant="flat"
          startContent={<ArrowLeft className="w-4 h-4" />}
          onClick={() => window.history.back()}
        >
          Halaman Sebelumnya
        </Button>
      </div>
      <p className="mt-8 text-sm text-gray-500 text-center">
        Jika Anda yakin seharusnya memiliki akses ke halaman ini, silakan hubungi tim dukungan kami.
      </p>
      <Button
        as={Link}
        href="/contact"
        color="primary"
        variant="light"
        className="mt-4"
      >
        Hubungi Dukungan
      </Button>
    </div>
  );
}