import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { db, storage } from "@/src/config/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const productCategories = [
  { label: "Komputer", value: "computer" },
  { label: "Laptop", value: "laptop" },
  { label: "Spare Part", value: "spare_part" },
  { label: "Penyimpanan", value: "storage" },
  { label: "Periferal", value: "peripheral" },
];

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image);
  const [productName, setProductName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState<number>(product.price);
  const [stock, setStock] = useState<number>(product.stock);
  const [description, setDescription] = useState(product.description);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update state when product prop changes
    setProductName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setStock(product.stock);
    setDescription(product.description);
    setImagePreview(product.image);
  }, [product]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
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
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!productName || !category || !price || !stock || !description) {
      toast.error("Harap lengkapi semua data!");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = product.image;

      if (uploadedImage) {
        // Upload new image if changed
        const imageRef = ref(storage, `products/${uploadedImage.name}`);
        await uploadBytes(imageRef, uploadedImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Update product data in Firestore
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, {
        name: productName,
        category: category,
        price: price,
        stock: stock,
        description: description,
        image: imageUrl,
        updatedAt: new Date(),
      });

      toast.success("Produk berhasil diperbarui!");
      onClose(); // Close modal after success
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui produk.");
      console.error("Error updating product: ", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg">Edit Produk</ModalHeader>
            <ModalBody className="gap-4">
              <Input label="Nama Produk" placeholder="Masukkan nama produk" required isRequired value={productName} onChange={(e) => setProductName(e.target.value)} size="sm" />
              <Select label="Kategori" placeholder="Pilih kategori produk" required isRequired selectedKeys={[category]} onSelectionChange={(keys) => setCategory(Array.from(keys)[0] as string)} size="sm">
                {productCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </Select>
              <Input label="Harga" placeholder="Masukkan harga produk" type="number" required isRequired value={price.toString()} onChange={(e) => setPrice(Number(e.target.value))} size="sm" />
              <Input label="Stok" placeholder="Masukkan jumlah stok" type="number" required isRequired value={stock.toString()} onChange={(e) => setStock(Number(e.target.value))} size="sm" />
              <Textarea label="Deskripsi Barang" required isRequired value={description} onChange={(e) => setDescription(e.target.value)} size="sm"></Textarea>
              <div className="mt-2">
                <p className="text-small font-medium mb-2">
                  Gambar Produk <span className="text-red-500">*</span>
                </p>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-2 text-center cursor-pointer ${isDragActive ? "border-primary" : "border-gray-300"}`}>
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" className="mx-auto max-h-32 object-contain" width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} />
                  ) : (
                    <div>
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-xs">Drag & drop gambar produk di sini, atau klik untuk memilih file</p>
                      <p className="text-xs text-gray-500">(Hanya file gambar dengan format JPG, JPEG, PNG, atau GIF)</p>
                    </div>
                  )}
                </div>
                {uploadedImage && <p className="mt-1 text-xs text-gray-500">File terpilih: {uploadedImage.name}</p>}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} size="sm">
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit} isDisabled={isSubmitting} size="sm">
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
