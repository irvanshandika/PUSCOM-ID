/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Pagination, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Select, SelectItem } from "@nextui-org/react";
import { Monitor, Search, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getFirestore, doc, updateDoc, getDocs, collection, addDoc } from "firebase/firestore";
import { auth } from "@/src/config/FirebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

type ServiceItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  brand: string;
  damage: string;
  status: "Pending" | "In Progress" | "Completed" | "Rejected";
  imageUrl: string;
};

export default function ServiceListPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState<ServiceItem[]>([]); // State untuk menyimpan data servis dari Firestore
  const rowsPerPage = 3;
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/forbidden");
    }

    // Ambil data dari Firestore dan masukkan ke state
  }, [loading, user, router]);

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
    fetchServiceData();
  }, [fetchServiceData]);

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

  const handleUpdateStatus = async (id: string, newStatus: "Pending" | "In Progress" | "Completed" | "Rejected") => {
    try {
      const serviceDoc = doc(db, "laptop_service_requests", id);
      await updateDoc(serviceDoc, { status: newStatus });

      setServiceData((prevData) => prevData.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));

      if (newStatus === "In Progress") {
        const selectedService = serviceData.find((item) => item.id === id);
        if (selectedService) {
          await addDoc(collection(db, "todo_services"), {
            ...selectedService,
            status: "In Progress",
          });
        }
      }
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const filteredData = serviceData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredData.length / rowsPerPage);

  const items = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const renderCell = (item: ServiceItem, columnKey: keyof ServiceItem) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{item.name}</p>
            <p className="text-bold text-tiny text-default-400">{item.email}</p>
          </div>
        );
      case "status":
        return (
          <Select value={item.status} size="sm" className="min-w-[150px]" placeholder={item.status} onChange={(e) => handleUpdateStatus(item.id, e.target.value as "In Progress" | "Completed" | "Rejected")}>
            <SelectItem key="In Progress" value="In Progress" color="warning">
              In Progress
            </SelectItem>
            <SelectItem key="Completed" value="Completed" color="success">
              Completed
            </SelectItem>
            <SelectItem key="Rejected" value="Rejected" color="danger">
              Rejected
            </SelectItem>
          </Select>
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
      case "id":
        return (
          <div className="flex space-x-2">
            {item.status === "Pending" && (
              <>
                <Button color="success" size="sm" onPress={() => handleUpdateStatus(item.id, "In Progress")}>
                  Terima
                </Button>
                <Button color="danger" size="sm" onPress={() => handleUpdateStatus(item.id, "Rejected")}>
                  Tolak
                </Button>
              </>
            )}
          </div>
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
                <div className="flex justify-center items-center">
                  <Image src={selectedImage || ""} alt="Kerusakan Laptop" width={500} height={300} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
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
