/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Textarea, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio, DateInput } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { Monitor, Upload, Printer, Download } from "lucide-react";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/src/config/FirebaseConfig";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import ServiceReceipt from "@/src/servercomponents/Servis/service-receipt";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ServisForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [jenisLaptop, setJenisLaptop] = useState("");
  const [damage, setDamage] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [queueNumber, setQueueNumber] = useState("");

  // Firestore and Storage initialization
  const db = getFirestore(app);
  const storage = getStorage(app);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  useEffect(() => {
    // Generate queue number when component mounts
    generateQueueNumber();
  }, []);

  const generateQueueNumber = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const serviceRequestsRef = collection(db, "laptop_service_requests");
    const q = query(serviceRequestsRef, where("createdAt", ">=", today), where("createdAt", "<", tomorrow));

    const querySnapshot = await getDocs(q);
    const number = querySnapshot.size + 1;
    setQueueNumber(number.toString().padStart(3, "0"));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (!user) {
        toast.error("Anda harus login terlebih dahulu untuk melakukan booking service.");
        setLoading(false);
        return;
      }

      const uid = user.uid;

      let imageUrl = "";
      if (selectedFile) {
        const storageRef = ref(storage, `laptop_service_images/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const serviceData = {
        name,
        email,
        phone,
        brand,
        model,
        damage,
        jenisLaptop,
        status: "pending",
        tanggal,
        imageUrl,
        createdAt: serverTimestamp(),
        uid: uid,
        queueNumber,
      };

      await addDoc(collection(db, "laptop_service_requests"), serviceData);

      toast.success("Permintaan servis berhasil dikirim!", {
        duration: 3000,
      });

      setShowReceipt(true);
    } catch (error) {
      console.error("Error submitting service form:", error);
      toast.error("Terjadi kesalahan saat mengirim permintaan servis.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptElement = document.getElementById("service-receipt");
    if (receiptElement) {
      html2canvas(receiptElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("service_receipt.pdf");
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-[4vh] pb-[10vh]">
      {!showReceipt ? (
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
              <Input type="text" placeholder="Masukkan nama lengkap Anda" variant="bordered" labelPlacement="outside" fullWidth value={name} onChange={(e) => setName(e.target.value)} isRequired required />
              <Input type="email" placeholder="Masukkan alamat email Anda" variant="bordered" labelPlacement="outside" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} isRequired required />
              <Input type="tel" placeholder="Masukkan nomor HP Anda" variant="bordered" labelPlacement="outside" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} isRequired required />
              <Select placeholder="Pilih brand laptop Anda" variant="bordered" labelPlacement="outside" value={brand} onChange={(e) => setBrand(e.target.value)} isRequired required>
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
              <Input type="text" placeholder="Masukkan model laptop Anda" variant="bordered" labelPlacement="outside" fullWidth value={model} onChange={(e) => setModel(e.target.value)} required />
              <RadioGroup label="Jenis Perangkat" value={jenisLaptop} onChange={(e) => setJenisLaptop(e.target.value)} isRequired>
                <Radio value="komputer">Komputer</Radio>
                <Radio value="laptop">Laptop</Radio>
              </RadioGroup>
              <DateInput label="Pilih tanggal servis" variant="bordered" labelPlacement="outside" value={tanggal ? parseDate(tanggal) : null} onChange={(date) => setTanggal(date?.toString() || "")} isRequired />
              <Textarea placeholder="Jelaskan kerusakan yang dialami laptop Anda" variant="bordered" labelPlacement="outside" minRows={3} value={damage} onChange={(e) => setDamage(e.target.value)} isRequired required />
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
                      <p className="text-sm text-gray-600">
                        Pastikan data dan nomor hp yang Anda masukkan sudah benar sebelum mengirim permintaan servis. Kami akan mengirimkan informasi lebih lanjut melalui email yang Anda masukkan ataupun nomor hp yang Anda daftarkan.
                      </p>
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
      ) : (
        <div id="service-receipt">
          <ServiceReceipt queueNumber={queueNumber} customerName={name} phoneNumber={phone} email={email} deviceType={jenisLaptop} brand={brand} model={model} problemDescription={damage} entryDate={new Date().toLocaleDateString()} />
        </div>
      )}
    </div>
  );
}
