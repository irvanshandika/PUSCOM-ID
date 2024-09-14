"use client";
import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Pagination, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from "@nextui-org/react";
import { Monitor, Search, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "@/src/config/FirebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Tambahkan Firestore SDK

// Tipe data untuk item servis
type ServiceItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  damage: string;
  brand: string;
  status: "Pending" | "In Progress" | "Completed";
  imageUrl: string;
};

export default function ServiceListPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState<ServiceItem[]>([]); // State untuk data asli dari Firestore
  const rowsPerPage = 3;
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const db = getFirestore(); // Inisialisasi Firestore

  // Fungsi untuk mengambil data dari Firestore
  const fetchServiceData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "laptop_service_requests"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ServiceItem[]; // Konversi data ke tipe `ServiceItem`
      setServiceData(data); // Simpan data di state
    } catch (err) {
      console.error("Error fetching service data:", err);
    }
  };

  useEffect(() => {
    // Fetch data dari Firestore ketika komponen di-mount
    fetchServiceData();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/forbidden");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading" color="primary" labelColor="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Filter data berdasarkan input pencarian
  const filteredData = serviceData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.damage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung jumlah halaman
  const pages = Math.ceil(filteredData.length / rowsPerPage);

  // Slice data berdasarkan halaman yang sedang aktif
  const items = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Fungsi untuk merender sel tabel
  const renderCell = (item: ServiceItem, columnKey: keyof ServiceItem) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{item.name}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{item.email}</p>
          </div>
        );
      case "status":
        return (
          <Chip color={item.status === "Completed" ? "success" : item.status === "In Progress" ? "warning" : "default"} variant="flat">
            {item.status}
          </Chip>
        );
      case "damage":
        return (
          <Tooltip content={cellValue}>
            <span className="truncate max-w-[200px]">{cellValue}</span>
          </Tooltip>
        );
      case "imageUrl":
        return (
          <Button size="sm" variant="flat" color="primary" startContent={<ImageIcon size={16} />} onPress={() => setSelectedImage(item.imageUrl)}>
            Lihat Gambar
          </Button>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Monitor className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">PUSCOM ID</h2>
          <p className="mt-2 text-sm text-gray-600">Daftar Permintaan Servis</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <Input placeholder="Cari berdasarkan nama, email, tipe perangkat, atau brand..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} startContent={<Search className="text-gray-400" />} />

          <Table aria-label="Tabel Daftar Permintaan Servis">
            <TableHeader>
              <TableColumn key="name">NAMA</TableColumn>
              <TableColumn key="phone">NOMOR HP</TableColumn>
              <TableColumn key="type">TIPE PERANGKAT</TableColumn>
              <TableColumn key="brand">BRAND</TableColumn>
              <TableColumn key="damage">DESKRIPSI MASALAH</TableColumn>
              <TableColumn key="status">STATUS</TableColumn>
              <TableColumn key="imageUrl">GAMBAR</TableColumn>
            </TableHeader>
            <TableBody items={items}>{(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey as keyof ServiceItem)}</TableCell>}</TableRow>}</TableBody>
          </Table>

          <div className="flex justify-center">
            <Pagination total={pages} page={page} onChange={(page) => setPage(page)} />
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Gambar Kerusakan</ModalHeader>
              <ModalBody>
                <Image src={selectedImage || ""} alt="Gambar kerusakan laptop/komputer" className="w-full h-auto object-contain" width={0} height={0} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
