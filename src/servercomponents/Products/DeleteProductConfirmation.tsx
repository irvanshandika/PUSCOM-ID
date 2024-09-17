// src/servercomponents/Products/DeleteProductConfirmation.tsx
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { db } from "@/src/config/FirebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

type DeleteProductConfirmationProps = {
  isOpen: boolean;
  productId: string;
  onClose: () => void;
};

const DeleteProductConfirmation: React.FC<DeleteProductConfirmationProps> = ({ isOpen, productId, onClose }) => {
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "products", productId);
      await deleteDoc(docRef);
      toast.success("Product deleted successfully!");
      onClose(); // Close modal after deleting
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>Are you sure you want to delete this product?</ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={handleDelete}>
            Delete
          </Button>
          <Button onPress={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteProductConfirmation;
