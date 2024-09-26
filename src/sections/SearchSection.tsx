"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";
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
      <section className="mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <form onSubmit={handleSearch}>
              <Input
                isClearable
                radius="lg"
                classNames={{
                  input: "text-small",
                  inputWrapper: "h-12",
                }}
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startContent={<Search className="text-gray-400" />}
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
