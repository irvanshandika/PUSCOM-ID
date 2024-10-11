"use client";
import React, { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "@/src/config/FirebaseConfig";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip, Card, CardBody } from "@nextui-org/react";
import { Eye, Trash2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Device {
  id: string;
  name: string;
  phone: string;
  deviceType: string;
  brand: string;
  model: string;
  specs: string;
  imageUrls: string[];
  createdAt: Date;
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const q = query(collection(db, "jual_db"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const fetchedDevices: Device[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedDevices.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Device);
    });
    setDevices(fetchedDevices);
  };

  const handleViewDetails = (device: Device) => {
    setSelectedDevice(device);
    onOpen();
  };

  const handleDelete = (device: Device) => {
    setSelectedDevice(device);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDevice) return;

    try {
      toast.loading("Menghapus data...", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px",
        },
      });

      await deleteDoc(doc(db, "jual_db", selectedDevice.id));

      const storage = getStorage();
      for (const imageUrl of selectedDevice.imageUrls) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      setDevices(devices.filter((d) => d.id !== selectedDevice.id));

      toast.dismiss();
      toast.success("Data berhasil dihapus", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Terjadi kesalahan saat menghapus data", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
    }

    setIsDeleteModalOpen(false);
    setSelectedDevice(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white shadow-xl">
        <CardBody>
          <h1 className="text-3xl font-bold mb-6 text-black">Dashboard Penjualan Laptop/Komputer</h1>
          {devices.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Maaf, Belum Ada Pengajuan Penjualan</h3>
              <p className="mt-1 text-sm text-gray-500">Belum ada data penjualan yang tersedia saat ini.</p>
            </div>
          ) : (
            <Table aria-label="Daftar Penjualan Laptop/Komputer" className="bg-white rounded-lg shadow">
              <TableHeader>
                <TableColumn>NAMA</TableColumn>
                <TableColumn>JENIS</TableColumn>
                <TableColumn>BRAND/TIPE</TableColumn>
                <TableColumn>MODEL</TableColumn>
                <TableColumn>TANGGAL</TableColumn>
                <TableColumn>AKSI</TableColumn>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.deviceType}</TableCell>
                    <TableCell>{device.brand}</TableCell>
                    <TableCell>{device.model || "-"}</TableCell>
                    <TableCell>{device.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Tooltip content="Lihat Detail">
                          <Button size="sm" color="default" variant="flat" isIconOnly onClick={() => handleViewDetails(device)}>
                            <Eye size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Hapus Data" color="danger">
                          <Button size="sm" color="danger" variant="flat" isIconOnly onClick={() => handleDelete(device)}>
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal size="4xl" isOpen={isOpen} onClose={onClose} className="bg-white rounded-lg shadow-xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">Detail Penjualan</ModalHeader>
              <ModalBody>
                {selectedDevice && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <Card>
                        <CardBody>
                          <h3 className="font-semibold text-lg mb-2 text-black">Informasi Pengguna</h3>
                          <p>
                            <span className="font-medium">Nama:</span> {selectedDevice.name}
                          </p>
                          <p>
                            <span className="font-medium">Nomor Telepon:</span> {selectedDevice.phone}
                          </p>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <h3 className="font-semibold text-lg mb-2 text-black">Informasi Perangkat</h3>
                          <p>
                            <span className="font-medium">Jenis:</span> {selectedDevice.deviceType}
                          </p>
                          <p>
                            <span className="font-medium">{selectedDevice.deviceType === "Laptop" ? "Brand" : "Tipe Komputer"}:</span> {selectedDevice.brand}
                          </p>
                          {selectedDevice.model && (
                            <p>
                              <span className="font-medium">Model:</span> {selectedDevice.model}
                            </p>
                          )}
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <h3 className="font-semibold text-lg mb-2 text-black">Tanggal Pengajuan</h3>
                          <p>{selectedDevice.createdAt.toLocaleString()}</p>
                        </CardBody>
                      </Card>
                    </div>
                    <div className="space-y-6">
                      <Card>
                        <CardBody>
                          <h3 className="font-semibold text-lg mb-2 text-black">Spesifikasi</h3>
                          <div dangerouslySetInnerHTML={{ __html: selectedDevice.specs }} />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <h3 className="font-semibold text-lg mb-2 text-black">Gambar Perangkat</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedDevice.imageUrls.map((url, index) => (
                              <Image key={index} src={url} alt={`Device ${index + 1}`} className="w-full h-32 object-cover rounded-lg" width={128} height={128} />
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="bg-white rounded-lg shadow-xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-black">Konfirmasi Penghapusan</ModalHeader>
          <ModalBody>
            <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-center mb-4">Apakah Anda yakin ingin menghapus data penjualan ini?</p>
            <Card>
              <CardBody>
                <p>
                  <span className="font-medium">Nama:</span> {selectedDevice?.name}
                </p>
                <p>
                  <span className="font-medium">Perangkat:</span> {selectedDevice?.deviceType} {selectedDevice?.brand} {selectedDevice?.model}
                </p>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
