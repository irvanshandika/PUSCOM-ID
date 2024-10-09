/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody } from "@nextui-org/react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-hot-toast";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/src/config/FirebaseConfig";
import { Upload, Check, X, LogIn } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const brands = ["Acer", "Apple", "Asus", "Dell", "HP", "Lenovo", "MSI", "Razer", "Samsung", "Toshiba"];
const computerTypes = ["All in One", "Gaming", "Desktop", "Mini PC", "Workstation"];

export default function SellForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [specs, setSpecs] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [user, setUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onOpen();
    } else {
      toast.error("Please sign in to submit the form", { icon: "🔒" });
    }
  };

  const confirmSubmit = async () => {
    onClose();
    if (images.length === 0) {
      toast.error("Please select at least one image", { icon: "🖼️" });
      return;
    }

    try {
      toast.loading("Mengunggah data...", { icon: "⏳" });

      await addDoc(collection(db, "jual_db"), {
        name,
        phone,
        deviceType,
        brand,
        model,
        specs,
        imageCount: images.length,
        userId: user.uid,
        createdAt: new Date(),
      });

      toast.dismiss();
      toast.success("Data berhasil dikirim!", { icon: "✅" });

      // Reset form
      setName("");
      setPhone("");
      setDeviceType("");
      setBrand("");
      setModel("");
      setSpecs("");
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.", { icon: "❌" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prevImages) => [...prevImages, ...Array.from(e.target.files || [])]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="p-6 shadow-lg">
        <CardBody>
          <h1 className="text-2xl font-bold mb-6 text-center">Jual Laptop/Komputer</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Nomor Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Select
              label="Jenis Perangkat"
              value={deviceType}
              onChange={(e) => {
                setDeviceType(e.target.value);
                setBrand("");
              }}
              required>
              <SelectItem key="Laptop" value="Laptop">
                Laptop
              </SelectItem>
              <SelectItem key="Komputer" value="Komputer">
                Komputer
              </SelectItem>
            </Select>
            <Select label={deviceType === "Laptop" ? "Brand" : "Tipe Komputer"} value={brand} onChange={(e) => setBrand(e.target.value)} required>
              {deviceType === "Laptop"
                ? brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))
                : computerTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
            </Select>
            {deviceType === "Laptop" && <Input label="Model Laptop" value={model} onChange={(e) => setModel(e.target.value)} required />}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spesifikasi</label>
              <ReactQuill theme="snow" value={specs} onChange={setSpecs} className="bg-white rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Perangkat</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                multiple
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Image src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover rounded" width={0} height={0} />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {user ? (
              <Button type="submit" color="primary" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Kirim
              </Button>
            ) : (
              <Button color="primary" className="w-full" onClick={() => router.push("/auth/signin")}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Konfirmasi Data</ModalHeader>
          <ModalBody>
            <p>Apakah Anda yakin data yang dimasukkan sudah benar?</p>
            <ul className="list-disc list-inside">
              <li>Nama: {name}</li>
              <li>Nomor Telepon: {phone}</li>
              <li>Jenis Perangkat: {deviceType}</li>
              <li>
                {deviceType === "Laptop" ? "Brand" : "Tipe Komputer"}: {brand}
              </li>
              {deviceType === "Laptop" && <li>Model: {model}</li>}
              <li>Jumlah Gambar: {images.length}</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" onPress={confirmSubmit}>
              <Check className="w-4 h-4 mr-2" />
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
