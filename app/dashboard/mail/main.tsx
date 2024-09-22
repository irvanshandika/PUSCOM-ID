/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  useDisclosure,
} from "@nextui-org/react";
import { Search, ChevronDown, Eye, Trash } from "lucide-react";
import { useContactStore } from "@/src/store/contactStore";
import DeleteConfirmationModal from "@/src/servercomponents/Mail/DeleteConfirmationModal";
import { auth, db } from "@/src/config/FirebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { doc, getDoc } from "firebase/firestore";

type Contact = {
  photoURL: string;
  id: string;
  name: string;
  email: string;
  message: string;
  status: "Baru" | "Dibaca" | "Dibalas";
  createdAt: Date;
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  Baru: "warning",
  Dibaca: "primary",
  Dibalas: "success",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "status", "createdAt", "actions"];

export default function ContactDashboard() {
  const { contacts, fetchContacts, deleteContact } = useContactStore();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = fetchContacts();
    return unsubscribe;
  }, [fetchContacts]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsAdmin(userData.roles === "admin");
        } else {
          setIsAdmin(false);
        }
        setCheckingRole(false);
      }
    };

    if (user) {
      checkUserRole();
    } else if (!loading) {
      router.push("/auth/signin"); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return [
      { name: "NAMA", uid: "name", sortable: true },
      { name: "EMAIL", uid: "email", sortable: true },
      { name: "STATUS", uid: "status", sortable: true },
      { name: "TANGGAL", uid: "createdAt", sortable: true },
      { name: "AKSI", uid: "actions" },
    ];
  }, []);

  const filteredItems = useMemo(() => {
    let filteredContacts = [...contacts];

    if (hasSearchFilter) {
      filteredContacts = filteredContacts.filter((contact) => contact.name.toLowerCase().includes(filterValue.toLowerCase()) || contact.email.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== Object.keys(statusColorMap).length) {
      filteredContacts = filteredContacts.filter((contact) => Array.from(statusFilter).includes(contact.status || ""));
    }

    return filteredContacts;
  }, [contacts, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Contact, b: Contact) => {
      const first = a[sortDescriptor.column as keyof Contact];
      const second = b[sortDescriptor.column as keyof Contact];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (contact: Contact, columnKey: React.Key) => {
      let cellValue = contact[columnKey as keyof Contact];

      if (cellValue instanceof Date) {
        cellValue = cellValue.toLocaleDateString();
      }

      switch (columnKey) {
        case "name":
          return (
            <User avatarProps={{ radius: "lg", src: `${contact.photoURL}` }} description={contact.email} name={String(cellValue)}>
              {contact.email}
            </User>
          );
        case "status":
          return (
            <Chip className="capitalize" color={statusColorMap[contact.status || "Baru"]} size="sm" variant="flat">
              {contact.status || "Baru"}
            </Chip>
          );
        case "createdAt":
          return cellValue;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Button isIconOnly size="sm" variant="light" onClick={(e) => router.push(`/dashboard/mail/${contact.id}`)}>
                <Eye size={20} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => {
                  setContactToDelete(contact);
                  onOpen();
                }}>
                <Trash size={20} />
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onOpen, router]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input isClearable className="w-full sm:max-w-[44%]" placeholder="Cari berdasarkan nama..." startContent={<Search />} value={filterValue} onClear={() => onClear()} onValueChange={onSearchChange} />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Table Columns" closeOnSelect={false} selectedKeys={statusFilter} selectionMode="multiple" onSelectionChange={setStatusFilter}>
                <DropdownItem key="Baru" className="capitalize">
                  Baru
                </DropdownItem>
                <DropdownItem key="Dibaca" className="capitalize">
                  Dibaca
                </DropdownItem>
                <DropdownItem key="Dibalas" className="capitalize">
                  Dibalas
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown />} variant="flat">
                  Kolom
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Table Columns" closeOnSelect={false} selectedKeys={visibleColumns} selectionMode="multiple" onSelectionChange={setVisibleColumns}>
                {headerColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {contacts.length} kontak</span>
          <label className="flex items-center text-default-400 text-small">
            Baris per halaman:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, contacts.length, onClear, headerColumns]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Semua item dipilih" : `${selectedKeys.size} dari ${filteredItems.length} dipilih`}</span>
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Sebelumnya
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Selanjutnya
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  if (loading || checkingRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading" color="primary" labelColor="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isAdmin) {
    router.push("/forbidden");
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Dashboard Kontak</h1>
      <Table
        aria-label="Tabel Kontak"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}>
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems} emptyContent={"Tidak ada kontak ditemukan"}>
          {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onDelete={() => {
          if (contactToDelete) {
            deleteContact(contactToDelete.id);
            onClose();
          }
        }}
        contactName={contactToDelete?.name || ""}
      />
    </div>
  );
}
