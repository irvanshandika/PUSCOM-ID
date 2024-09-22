import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  contactName: string;
};

export default function DeleteConfirmationModal({ isOpen, onClose, onDelete, contactName }: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Konfirmasi Hapus</ModalHeader>
        <ModalBody>
          <p>Apakah Anda yakin ingin menghapus pesan dari {contactName}?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button color="danger" onPress={onDelete}>
            Hapus
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
