/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Input, Textarea, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { Monitor, Upload } from "lucide-react";
import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/src/config/FirebaseConfig"; // Pastikan ini adalah path yang benar untuk FirebaseConfig Anda
import { toast } from "react-hot-toast";

export default function ServisForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // State untuk input form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [jenisLaptop, setJenisLaptop] = useState("");
  const [damage, setDamage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Firestore and Storage initialization
  const db = getFirestore(app);
  const storage = getStorage(app);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Upload image to Firebase Storage if available
      let imageUrl = "";
      if (selectedFile) {
        const storageRef = ref(storage, `laptop_service_images/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Save service data to Firestore with a unique ID
      const serviceData = {
        name,
        email,
        phone,
        brand,
        type,
        damage,
        jenisLaptop,
        status: "pending",
        imageUrl, // Save the image URL to Firestore
        createdAt: new Date(),
      };

      // Use addDoc to generate a unique ID for each document
      await addDoc(collection(db, "laptop_service_requests"), serviceData);

      toast.success("Permintaan servis berhasil dikirim!", {
        duration: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting service form:", error);
      toast.error("Terjadi kesalahan saat mengirim permintaan servis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-[4vh] pb-[10vh]">
      <div className="max-w-2xl w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Monitor className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">PUSCOM ID</h2>
          <p className="mt-2 text-sm text-gray-600">Laptop Service Request Form</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input type="text" placeholder="Masukkan nama lengkap Anda" variant="bordered" labelPlacement="outside" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Masukkan alamat email Anda" variant="bordered" labelPlacement="outside" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="tel" placeholder="Masukkan nomor HP Anda" variant="bordered" labelPlacement="outside" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Select placeholder="Pilih brand laptop Anda" variant="bordered" labelPlacement="outside" value={brand} onChange={(e) => setBrand(e.target.value)} required>
              <SelectItem key="asus" value="Asus">
                Asus
              </SelectItem>
              <SelectItem key="acer" value="Acer">
                Acer
              </SelectItem>
              <SelectItem key="dell" value="Dell">
                Dell
              </SelectItem>
              <SelectItem key="hp" value="HP">
                HP
              </SelectItem>
              <SelectItem key="lenovo" value="Lenovo">
                Lenovo
              </SelectItem>
              <SelectItem key="other" value="Other">
                Lainnya
              </SelectItem>
            </Select>
            <Input type="text" placeholder="Masukkan tipe laptop Anda" variant="bordered" labelPlacement="outside" fullWidth value={type} onChange={(e) => setType(e.target.value)} required />
            <RadioGroup label="Jenis Perangkat" value={jenisLaptop} onChange={(e) => setJenisLaptop(e.target.value)} isRequired>
              <Radio value="komputer">Komputer</Radio>
              <Radio value="laptop">Laptop</Radio>
            </RadioGroup>
            <Textarea placeholder="Jelaskan kerusakan yang dialami laptop Anda" variant="bordered" labelPlacement="outside" minRows={3} value={damage} onChange={(e) => setDamage(e.target.value)} required />
            <div>
              <label htmlFor="laptop-image" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar Laptop
              </label>
              <div className="flex items-center space-x-2">
                <Button as="label" htmlFor="laptop-image" variant="bordered" startContent={<Upload className="h-4 w-4" />}>
                  Pilih File
                </Button>
                <span className="text-sm text-gray-500">{selectedFile ? selectedFile.name : "Tidak ada file yang dipilih"}</span>
              </div>
              <input id="laptop-image" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" required />
            </div>
          </div>

          <Button onPress={onOpen} color="primary" fullWidth size="lg">
            Kirim Permintaan Servis
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Verifikasi</ModalHeader>
                  <ModalBody>
                    <p className="text-sm text-gray-600">Pastikan data dan nomor hp yang Anda masukkan sudah benar sebelum mengirim permintaan servis.</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary" disabled={loading} onClick={handleSubmit}>
                      {loading ? "Mengirim..." : "Ya, data saya sudah benar"}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </form>
      </div>
    </div>
  );
}
