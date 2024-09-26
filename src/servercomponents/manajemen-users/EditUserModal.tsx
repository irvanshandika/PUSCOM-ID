'use client'
import { useState, useEffect } from "react";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, app } from "@/src/config/FirebaseConfig";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { UserRoles, UserData, UserStatus } from "@/app/dashboard/users/main";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserData) => void;
  user: UserData | null;
}

const EditUserModal = ({ isOpen, onClose, onUpdateUser, user }: EditUserModalProps) => {
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (user) {
      setEditingUser(user);
    }
  }, [user]);

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        const auth = getAuth(app);
        const userRef = doc(db, "users", editingUser.id);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          throw new Error("User not found");
        }

        const userData = userSnapshot.data();
        const firebaseUser = auth.currentUser;

        if (firebaseUser && userData.uid === firebaseUser.uid) {
          await updateProfile(firebaseUser, {
            displayName: editingUser.displayName,
          });

          if (editingUser.email !== user?.email) {
            await updateEmail(firebaseUser, editingUser.email);
          }
        }

        await updateDoc(userRef, {
          displayName: editingUser.displayName,
          email: editingUser.email,
          roles: editingUser.roles,
          status: editingUser.status,
        });

        onUpdateUser(editingUser);
      } catch (error) {
        console.error("Error updating user: ", error);
      }
    }
  };

  if (!editingUser) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Pengguna</ModalHeader>
        <ModalBody>
          <Input label="Nama" placeholder="Masukkan nama pengguna" value={editingUser.displayName} onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })} />
          <Input label="Email" placeholder="Masukkan email pengguna" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
          <Select label="Peran" placeholder="Pilih peran pengguna" selectedKeys={[editingUser.roles]} onChange={(e) => setEditingUser({ ...editingUser, roles: e.target.value as UserRoles })}>
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
          <Select label="Status" placeholder="Pilih status pengguna" selectedKeys={[editingUser.status]} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}>
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
          <Button color="primary" onPress={handleUpdateUser}>
            Perbarui
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
