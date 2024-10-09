/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, app } from "@/src/config/FirebaseConfig";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Tooltip } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import AddUserModal from "@/src/servercomponents/manajemen-users/AddUserModal";
import EditUserModal from "@/src/servercomponents/manajemen-users/EditUserModal";
import DeleteUserModal from "@/src/servercomponents/manajemen-users/DeleteUserModal";
import { Edit, Trash2 } from "lucide-react";

export type UserRoles = "admin" | "teknisi" | "customer";
export type UserStatus = "Aktif" | "Nonaktif";

export interface UserData {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  roles: UserRoles;
  status: UserStatus;
}

const auth = getAuth(app);

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast.error("Gagal mengambil data pengguna.");
    }
  };

  const handleAddUser = (newUser: UserData) => {
    setIsAddModalOpen(false);
    toast.success("Pengguna baru berhasil ditambahkan.");
  };

  const handleUpdateUser = (updatedUser: UserData) => {
    const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
    setUsers(updatedUsers);
    setEditingUser(null);
    setIsEditModalOpen(false);
    toast.success("Pengguna berhasil diperbarui.");
  };

  const handleDeleteUser = async () => {
    if (deletingUser) {
      try {
        await deleteDoc(doc(db, "users", deletingUser.id));
        setUsers(users.filter((user) => user.id !== deletingUser.id));
        setDeletingUser(null);
        setIsDeleteModalOpen(false);
        toast.success("Pengguna berhasil dihapus.");
      } catch (error) {
        console.error("Error deleting user: ", error);
        toast.error("Gagal menghapus pengguna.");
      }
    }
  };

  return (
    <div>
      <h1>Manajemen Pengguna</h1>
      <Button color="primary" onPress={() => setIsAddModalOpen(true)}>
        Tambah Pengguna
      </Button>
      <Table>
        <TableHeader>
          <TableColumn>Nama</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Peran</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Aksi</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <Tooltip content="Edit Pengguna">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setEditingUser(user);
                      setIsEditModalOpen(true);
                    }}>
                    <Edit size={20} />
                  </Button>
                </Tooltip>
                <Tooltip content="Hapus Pengguna" color="danger">
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setDeletingUser(user);
                      setIsDeleteModalOpen(true);
                    }}>
                    <Trash2 size={20} />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddUser={handleAddUser} />

      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onUpdateUser={handleUpdateUser} user={editingUser} />

      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onDeleteUser={handleDeleteUser} user={deletingUser} />
    </div>
  );
};

export default UserManagement;
