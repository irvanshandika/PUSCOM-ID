'use client'
import React from "react";
import { Button, Input } from "@nextui-org/react";
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error404Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col justify-center items-center px-4">
      <FileQuestion className="w-24 h-24 text-blue-500 mb-8" />
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 text-center">404 Halaman Tidak Ditemukan</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.</p>
      <div className="w-full max-w-md mb-8">
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <Input placeholder="Cari di PUSCOM..." startContent={<Search className="text-gray-400" />} className="flex-grow" />
          <Button color="primary" type="submit">
            Cari
          </Button>
        </form>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button as={Link} href="/" color="primary" variant="solid" startContent={<Home className="w-4 h-4" />}>
          Kembali ke Beranda
        </Button>
        <Button color="default" variant="flat" startContent={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>
          Halaman Sebelumnya
        </Button>
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Mungkin Anda mencari:</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/catalog" className="text-blue-600 hover:underline">
              Katalog Produk
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-blue-600 hover:underline">
              Tentang Kami
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-blue-600 hover:underline">
              Hubungi Kami
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-blue-600 hover:underline">
              FAQ
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
