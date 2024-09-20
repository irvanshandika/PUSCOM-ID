"use client";
import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { Search, Cpu, Laptop, Monitor } from "lucide-react";
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
    <div className="bg-cover bg-no-repeat bg-center text-white py-20 mt-[5vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb')" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Temukan Komputer Impian Anda</h1>
          <p className="text-xl md:text-2xl mb-8">Dari komponen terkini hingga laptop performa tinggi, kami punya semuanya</p>

          <Card className="mb-8">
            <CardBody>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <Input type="text" placeholder="Cari komponen, komputer, atau laptop..." value={search} onChange={(e) => setSearch(e.target.value)} startContent={<Search className="text-gray-400" />} className="flex-grow" />
                <Button color="primary" type="submit">
                  Cari
                </Button>
              </form>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-6">
              <Cpu className="w-8 h-8 mr-3" />
              <span className="text-lg">Komponen Terbaru</span>
            </div>
            <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-6">
              <Laptop className="w-8 h-8 mr-3" />
              <span className="text-lg">Laptop Gaming</span>
            </div>
            <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-lg p-6">
              <Monitor className="w-8 h-8 mr-3" />
              <span className="text-lg">Komputer Rakitan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
