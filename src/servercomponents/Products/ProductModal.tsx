import React, { useCallback } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import useProductStore from "@/src/store/productStore";

const productCategories = [
  { label: "Komputer", value: "Computer" },
  { label: "Laptop", value: "Laptop" },
  { label: "Spare Part", value: "Spare Part" },
  { label: "Penyimpanan", value: "Storage" },
  { label: "Periferal", value: "Peripheral" },
];

const productStatuses = [
  { label: "Baru", value: "Baru" },
  { label: "Bekas", value: "Bekas" },
];

const ecommercePlatforms = [
  { label: "Shopee", value: "shopee" },
  { label: "Tokopedia", value: "tokopedia" },
  { label: "BliBli", value: "blibli" },
];

export default function ProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    productName,
    category,
    status,
    price,
    stock,
    description,
    imagePreview,
    isSubmitting,
    ecommerceURLs,
    addEcommerceURL,
    removeEcommerceURL,
    updateEcommerceURL,
    setProductName,
    setCategory,
    setStatus,
    setPrice,
    setStock,
    setDescription,
    handleImageUpload,
    submitProduct,
  } = useProductStore();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        toast.error("Tipe file tidak diizinkan. Hanya format JPG, JPEG, PNG, atau GIF yang diperbolehkan.");
        return;
      }

      const file = acceptedFiles[0];
      handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const handleSubmit = async () => {
    await submitProduct();
    onClose();
  };

  const availablePlatforms = ecommercePlatforms.filter((platform) => !ecommerceURLs.find((url) => url.platform === platform.value));

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg">Tambah Produk Baru</ModalHeader>
            <ModalBody className="gap-4">
              <Input label="Nama Produk" placeholder="Masukkan nama produk" required isRequired value={productName} onChange={(e) => setProductName(e.target.value)} size="sm" />
              <Select label="Kategori" placeholder="Pilih kategori produk" required isRequired value={category} onChange={(e) => setCategory(e.target.value)} size="sm">
                {productCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </Select>
              <Input label="Harga" placeholder="Masukkan harga produk" type="number" required isRequired value={price?.toString() ?? ""} onChange={(e) => setPrice(Number(e.target.value))} size="sm" />
              <Input label="Stok" placeholder="Masukkan jumlah stok" type="number" required isRequired value={stock?.toString() ?? ""} onChange={(e) => setStock(Number(e.target.value))} size="sm" />
              <Textarea label="Deskripsi Barang" required isRequired value={description} onChange={(e) => setDescription(e.target.value)} size="sm" />
              {/* Status Produk */}
              <Select label="Status" placeholder="Pilih status produk" required isRequired value={status} onChange={(e) => setStatus(e.target.value)} size="sm">
                {productStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>

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
                      <p className="text-xs text-gray-500">(Hanya file gambar dengan format JPG, JPEG, PNG, WEBP, atau GIF)</p>
                    </div>
                  )}
                </div>
              </div>
              {/* E-commerce URLs Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-small font-medium">E-commerce URLs</p>
                  <Select placeholder="Tambah URL E-commerce" size="sm" className="max-w-[200px]" isDisabled={availablePlatforms.length === 0} onChange={(e) => addEcommerceURL(e.target.value, "")}>
                    {availablePlatforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {ecommerceURLs.map((item) => (
                  <div key={item.platform} className="flex items-center gap-2">
                    <div className="w-[100px]">
                      <span className="text-small font-medium">{ecommercePlatforms.find((p) => p.value === item.platform)?.label}</span>
                    </div>
                    <Input placeholder={`Masukkan URL ${ecommercePlatforms.find((p) => p.value === item.platform)?.label}`} value={item.url} onChange={(e) => updateEcommerceURL(item.platform, e.target.value)} size="sm" className="flex-1" />
                    <Button isIconOnly color="danger" variant="light" onPress={() => removeEcommerceURL(item.platform)} size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} size="sm">
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit} isDisabled={isSubmitting} size="sm">
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
