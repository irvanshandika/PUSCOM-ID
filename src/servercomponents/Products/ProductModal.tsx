import React, { useState, useCallback } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast"; // Import react hot toast
import { db, storage } from "@/src/config/FirebaseConfig"; // Import Firebase instance
import { addDoc, collection } from "firebase/firestore"; // Firestore for database
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firestore Storage

const productCategories = [
  { label: "Komputer", value: "computer" },
  { label: "Laptop", value: "laptop" },
  { label: "Spare Part", value: "spare_part" },
  { label: "Penyimpanan", value: "storage" },
  { label: "Periferal", value: "peripheral" },
];

export default function ProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      toast.error("Tipe file tidak diizinkan. Hanya format JPG, JPEG, PNG, atau GIF yang diperbolehkan.");
      return;
    }

    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maaf, Ukuran Melebihi Batas 10MB");
      return;
    }

    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submits
    if (!productName || !category || !price || !stock || !description || !uploadedImage) {
      toast.error("Harap lengkapi semua data!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `products/${uploadedImage.name}`);
      await uploadBytes(imageRef, uploadedImage);
      const imageUrl = await getDownloadURL(imageRef);

      // Save product data to Firestore
      await addDoc(collection(db, "products"), {
        name: productName,
        category: category,
        price: price,
        stock: stock,
        description: description,
        image: imageUrl, // Save image URL to Firestore
        createdAt: new Date(),
      });

      toast.success("Produk berhasil ditambahkan!");
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan produk.");
      console.error("Error adding product: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setCategory("");
    setPrice(null);
    setStock(null);
    setDescription("");
    setUploadedImage(null);
    setImagePreview(null);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Tambah Produk Baru</ModalHeader>
            <ModalBody>
              <Input label="Nama Produk" placeholder="Masukkan nama produk" required isRequired value={productName} onChange={(e) => setProductName(e.target.value)} />
              <Select label="Kategori" placeholder="Pilih kategori produk" required isRequired value={category} onChange={(e) => setCategory(e.target.value)}>
                {productCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              <Input label="Harga" placeholder="Masukkan harga produk" type="number" required isRequired value={price?.toString() ?? ""} onChange={(e) => setPrice(Number(e.target.value))} />
              <Input label="Stok" placeholder="Masukkan jumlah stok" type="number" required isRequired value={stock?.toString() ?? ""} onChange={(e) => setStock(Number(e.target.value))} />
              <Textarea label="Deskripsi Barang" required isRequired value={description} onChange={(e) => setDescription(e.target.value)}></Textarea>
              <div className="mt-4">
                <p className="text-small font-medium mb-2">
                  Gambar Produk <span className="text-red-500">*</span>
                </p>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${isDragActive ? "border-primary" : "border-gray-300"}`}>
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" className="mx-auto max-h-40 object-contain" width={0} height={0} />
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">Drag & drop gambar produk di sini, atau klik untuk memilih file</p>
                      <p className="text-small text-gray-500">(Hanya file gambar dengan format JPG, JPEG, PNG, WEBP, atau GIF)</p>
                    </div>
                  )}
                </div>
                {uploadedImage && <p className="mt-2 text-small text-gray-500">File terpilih: {uploadedImage.name}</p>}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit} isDisabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
