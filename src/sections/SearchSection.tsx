"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      router.push("/result?search=" + search);
    }
  };

  return (
    <>
      <section>
        <form onSubmit={handleSearch} className="bg-white mt-12 flex px-1 py-1.5 rounded-full shadow-md border overflow-hidden">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari Produk..." className="w-full text-gray-800 outline-none pl-4 text-sm" />
          <button type="button" className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 transition-all text-white tracking-wide text-sm rounded-full">
            Search
          </button>
        </form>
      </section>
    </>
  );
}
