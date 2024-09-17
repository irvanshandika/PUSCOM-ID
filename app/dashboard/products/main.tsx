/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Pagination,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
  DropdownSection,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Plus, EllipsisVertical, Edit2Icon, Trash2Icon } from "lucide-react";
import ProductModal from "@/src/servercomponents/Products/ProductModal";
import EditProductModal from "@/src/servercomponents/Products/EditProductModal";
import { db } from "@/src/config/FirebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string; // Add description key to Product type
  actions?: string; // Add actions key to Product type
};

// Fungsi untuk memformat harga
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ProductDashboard() {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rowsPerPage = 4;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fungsi untuk mengambil data produk dari Firestore
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productData);
    } catch (error) {
      toast.error("Gagal mengambil data produk.");
      console.error("Error fetching products: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data saat halaman pertama kali dirender
  useEffect(() => {
    fetchProducts();
  }, []);

  const pages = Math.ceil(products.length / rowsPerPage);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteDoc(doc(db, "products", selectedProduct.id));
        toast.success("Produk berhasil dihapus!");
        fetchProducts(); // Refresh the product list
      } catch (error) {
        toast.error("Gagal menghapus produk.");
        console.error("Error deleting product: ", error);
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return products.slice(start, end);
  }, [page, products]);

  const renderCell = useCallback((product: Product, columnKey: keyof Product) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User avatarProps={{ radius: "lg", src: product.image }} description={product.category} name={cellValue}>
            {product.name}
          </User>
        );
      case "category":
        return (
          <Chip color={product.category === "laptop" ? "primary" : product.category === "spare_part" ? "secondary" : "default"} variant="flat">
            {cellValue}
          </Chip>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">Rp {formatPrice(product.price)}</p>
          </div>
        );
      case "stock":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <>
            <Dropdown
              showArrow
              classNames={{
                base: "before:bg-default-200", // change arrow background
                content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
              }}>
              <DropdownTrigger>
                <button>
                  <EllipsisVertical />
                </button>
              </DropdownTrigger>
              <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
                <DropdownSection title="Actions">
                  <DropdownItem key="edit" shortcut="⌘⇧E" description="Allows you to edit the file" startContent={<Edit2Icon className={iconClasses} />} onPress={() => handleEdit(product)}>
                    Edit file
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger zone">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    shortcut="⌘⇧D"
                    description="Permanently delete the file"
                    startContent={<Trash2Icon className={cn(iconClasses, "text-danger")} />}
                    onPress={() => handleDelete(product)}>
                    Delete file
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchProducts(); // Fetch data again after closing the modal
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <Button color="primary" endContent={<Plus />} onPress={() => setIsModalOpen(true)}>
          Tambah Produk
        </Button>
      </div>

      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <Table
            aria-label="Tabel Produk"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={(page) => setPage(page)} />
              </div>
            }>
            <TableHeader>
              <TableColumn key="name">NAMA</TableColumn>
              <TableColumn key="category">KATEGORI</TableColumn>
              <TableColumn key="price">HARGA</TableColumn>
              <TableColumn key="stock">STOK</TableColumn>
              <TableColumn key="actions">AKSI</TableColumn>
            </TableHeader>
            <TableBody items={items}>{(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey as keyof Product)}</TableCell>}</TableRow>}</TableBody>
          </Table>
        </>
      )}
      {/* Modal untuk menambah produk */}
      <ProductModal isOpen={isModalOpen} onClose={handleModalClose} />

      {/* Modal untuk mengedit produk */}
      {selectedProduct && (
        <>
          <EditProductModal isOpen={isEditModalOpen} onClose={handleEditModalClose} product={selectedProduct} />
        </>
      )}

      {/* Modal konfirmasi hapus */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={() => setIsDeleteModalOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Konfirmasi Hapus</ModalHeader>
              <ModalBody>
                <p>Apakah Anda yakin ingin menghapus produk "{selectedProduct?.name}"?</p>
                <p>Tindakan ini tidak dapat dibatalkan.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
