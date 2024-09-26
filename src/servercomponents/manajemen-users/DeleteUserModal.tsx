"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { UserData } from "@/app/dashboard/users/main";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteUser: () => void;
  user: UserData | null;
}

const DeleteUserModal = ({ isOpen, onClose, onDeleteUser, user }: DeleteUserModalProps) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Konfirmasi Hapus Pengguna</ModalHeader>
        <ModalBody>Apakah Anda yakin ingin menghapus pengguna {user.displayName}?</ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button color="danger" onPress={onDeleteUser}>
            Hapus
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteUserModal;
