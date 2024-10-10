"use client";
import React, { useState, useRef } from "react";
import { Input, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody, Tooltip } from "@nextui-org/react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-hot-toast";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/src/config/FirebaseConfig";
import { Upload, Check, X, Info } from "lucide-react";
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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onOpen();
  };

  const confirmSubmit = async () => {
    onClose();
    if (images.length === 0) {
      toast.error("Pilih setidaknya satu gambar", { icon: "🖼️" });
      return;
    }

    try {
      toast.loading("Mengunggah data...", { icon: "⏳" });

      const storage = getStorage();
      const imageUrls: string[] = [];

      for (const image of images) {
        const imageRef = ref(storage, `device_images/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      }

      await addDoc(collection(db, "jual_db"), {
        name,
        phone,
        deviceType,
        brand,
        model,
        specs,
        imageUrls,
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
      setPreviewUrls([]);
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
      const newImages = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newImages]);

      const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => {
      URL.revokeObjectURL(prevUrls[index]);
      return prevUrls.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="p-6 shadow-xl bg-gradient-to-br from-blue-50 to-white">
        <CardBody>
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Jual Laptop/Komputer</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              isRequired
              className="max-w-full"
              classNames={{
                input: "bg-white",
              }}
            />
            <Input
              label="Nomor Telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              isRequired
              className="max-w-full"
              classNames={{
                input: "bg-white",
              }}
            />
            <Select
              label="Jenis Perangkat"
              value={deviceType}
              onChange={(e) => {
                setDeviceType(e.target.value);
                setBrand("");
              }}
              required
              isRequired
              className="max-w-full">
              <SelectItem key="Laptop" value="Laptop">
                Laptop
              </SelectItem>
              <SelectItem key="Komputer" value="Komputer">
                Komputer
              </SelectItem>
            </Select>
            {deviceType === "Laptop" ? (
              <Select label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required isRequired className="max-w-full">
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <Select label="Tipe Komputer" value={brand} onChange={(e) => setBrand(e.target.value)} required isRequired className="max-w-full">
                {computerTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </Select>
            )}
            {deviceType === "Laptop" && (
              <Input
                label="Model Laptop"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                isRequired
                className="max-w-full"
                classNames={{
                  input: "bg-white",
                }}
              />
            )}
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-2">
                Spesifikasi <span className="text-red-500">*</span>
              </label>
              <ReactQuill theme="snow" value={specs} onChange={setSpecs} className="bg-white rounded-lg h-28 mb-16" />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-600 mb-2 flex items-center">
                Gambar Perangkat <span className="text-red-500 ml-1">*</span>
                <Tooltip content="Maksimal 20MB per gambar">
                  <Info size={16} className="ml-2 text-blue-500" />
                </Tooltip>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                multiple
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  transition duration-300 ease-in-out"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg transition duration-300 ease-in-out group-hover:opacity-75" width={128} height={128} />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <Button type="submit" color="primary" className="w-full transition duration-300 ease-in-out transform hover:scale-105">
              <Upload className="w-4 h-4 mr-2" />
              Kirim
            </Button>
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} className="bg-white rounded-lg shadow-xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-blue-600">Konfirmasi Data</ModalHeader>
          <ModalBody>
            <p className="text-gray-600 mb-4">Apakah Anda yakin data yang dimasukkan sudah benar?</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Nama: <span className="font-semibold">{name}</span>
              </li>
              <li>
                Nomor Telepon: <span className="font-semibold">{phone}</span>
              </li>
              <li>
                Jenis Perangkat: <span className="font-semibold">{deviceType}</span>
              </li>
              <li>
                {deviceType === "Laptop" ? "Brand" : "Tipe Komputer"}: <span className="font-semibold">{brand}</span>
              </li>
              {deviceType === "Laptop" && (
                <li>
                  Model: <span className="font-semibold">{model}</span>
                </li>
              )}
              <li>
                Jumlah Gambar: <span className="font-semibold">{images.length}</span>
              </li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose} className="transition duration-300 ease-in-out">
              Batal
            </Button>
            <Button color="primary" onPress={confirmSubmit} className="transition duration-300 ease-in-out">
              <Check className="w-4 h-4 mr-2" />
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
