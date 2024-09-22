import { create } from "zustand";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/src/config/FirebaseConfig";

type Contact = {
  photoURL: string;
  id: string;
  name: string;
  email: string;
  message: string;
  status: "Baru" | "Dibaca" | "Dibalas";
  createdAt: Date;
};

type ContactStore = {
  contacts: Contact[];
  fetchContacts: () => void;
  deleteContact: (contactId: string) => Promise<void>;
};

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [],
  fetchContacts: () => {
    const q = query(collection(db, "pesan"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const contactsData: Contact[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as Contact)
      );
      set({ contacts: contactsData });
    });
    return unsubscribe;
  },
  deleteContact: async (contactId: string) => {
    try {
      await deleteDoc(doc(db, "pesan", contactId));
      console.log("Pesan berhasil dihapus");
    } catch (error) {
      console.error("Error menghapus pesan:", error);
    }
  },
}));
