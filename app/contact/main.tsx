"use client";
import React, { useState } from "react";
import { Card, CardBody, Input, Button, Divider } from "@nextui-org/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementasi pengiriman formulir akan ditambahkan di sini
    console.log("Form submitted", { name, email, subject, message });
  };

  const modules = {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]],
  };

  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "image"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Hubungi Kami</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Informasi Kontak</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-6 h-6 mr-2 text-primary" />
                <p>info@techgenius.com</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-6 h-6 mr-2 text-primary" />
                <p>(021) 123-4567</p>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-primary" />
                <p>Jl. Teknologi 123, Kota Digital, 12345</p>
              </div>
            </div>

            <Divider className="my-6" />

            <h3 className="text-xl font-semibold mb-4">Jam Operasional</h3>
            <ul className="space-y-2">
              <li>Senin - Jumat: 09:00 - 18:00</li>
              <li>Sabtu: 10:00 - 15:00</li>
              <li>Minggu: Tutup</li>
            </ul>

            <Divider className="my-6" />

            <h3 className="text-xl font-semibold mb-4">Lokasi Kami</h3>
            <div className="relative w-full h-64">
              <Image src="/placeholder.svg?height=256&width=512" alt="Peta Lokasi TechGenius" layout="fill" objectFit="cover" className="rounded-lg" />
            </div>
          </CardBody>
        </Card>

        <Card className="p-6">
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nama" placeholder="Masukkan nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" placeholder="Masukkan alamat email Anda" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Subjek" placeholder="Masukkan subjek pesan" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <ReactQuill theme="snow" value={message} onChange={setMessage} modules={modules} formats={formats} placeholder="Tulis pesan Anda di sini" />
              </div>
              <Button color="primary" type="submit" endContent={<Send className="w-4 h-4" />}>
                Kirim Pesan
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
