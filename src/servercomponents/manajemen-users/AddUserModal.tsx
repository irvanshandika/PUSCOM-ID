"use client";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db, app } from "@/src/config/FirebaseConfig";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { UserRoles, UserData, UserStatus } from "@/app/dashboard/users/main";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: UserData) => void;
}

const AddUserModal = ({ isOpen, onClose, onAddUser }: AddUserModalProps) => {
  const [newUser, setNewUser] = useState({
    displayName: "",
    email: "",
    password: "",
    roles: "customer" as UserRoles,
    status: "Aktif" as UserStatus,
  });

  const handleAddUser = async () => {
    if (newUser.displayName && newUser.email && newUser.password && newUser.roles) {
      try {
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: newUser.displayName,
        });

        const userDoc = await addDoc(collection(db, "users"), {
          uid: user.uid,
          displayName: newUser.displayName,
          email: newUser.email,
          roles: newUser.roles,
          status: newUser.status,
        });

        onAddUser({ id: userDoc.id, uid: user.uid, ...newUser });
        setNewUser({ displayName: "", email: "", password: "", roles: "customer", status: "Aktif" });
      } catch (error) {
        console.error("Error adding new user: ", error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Tambah Pengguna Baru</ModalHeader>
        <ModalBody>
          <Input label="Nama" placeholder="Masukkan nama pengguna" value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })} />
          <Input label="Email" placeholder="Masukkan email pengguna" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <Input label="Password" placeholder="Masukkan password pengguna" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <Select label="Peran" placeholder="Pilih peran pengguna" selectedKeys={[newUser.roles]} onChange={(e) => setNewUser({ ...newUser, roles: e.target.value as UserRoles })}>
            <SelectItem key="admin" value="admin">
              Admin
            </SelectItem>
            <SelectItem key="teknisi" value="teknisi">
              Teknisi
            </SelectItem>
            <SelectItem key="customer" value="customer">
              Customer
            </SelectItem>
          </Select>
          <Select label="Status" placeholder="Pilih status pengguna" selectedKeys={[newUser.status]} onChange={(e) => setNewUser({ ...newUser, status: e.target.value as UserStatus })}>
            <SelectItem key="Aktif" value="Aktif">
              Aktif
            </SelectItem>
            <SelectItem key="Nonaktif" value="Nonaktif">
              Nonaktif
            </SelectItem>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button color="primary" onPress={handleAddUser}>
            Tambah
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
