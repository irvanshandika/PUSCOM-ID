// src/stores/userStore.ts
import { create } from "zustand";
import { db } from "@/src/config/FirebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

type UserRoles = "Admin" | "Teknisi";

interface UserData {
  id: string;
  photoURL: string;
  displayName: string;
  email: string;
  password?: string;
  roles: UserRoles;
  status: "Aktif" | "Nonaktif";
}

interface UserStore {
  users: UserData[];
  editingUser: UserData | null;
  newUser: Partial<UserData>;
  fetchUsers: () => Promise<void>;
  addUser: () => Promise<void>;
  updateUser: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setEditingUser: (user: UserData | null) => void;
  setNewUser: (user: Partial<UserData>) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  editingUser: null,
  newUser: {
    displayName: "",
    photoURL: "",
    email: "",
    password: "",
    roles: "Teknisi",
    status: "Aktif",
  },

  fetchUsers: async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as UserData));
      set({ users: usersData });
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast.error("Gagal memuat data pengguna.");
    }
  },

  addUser: async () => {
    const { newUser } = get();
    if (newUser.displayName && newUser.email && newUser.password && newUser.roles) {
      try {
        const usersCollection = collection(db, "users");
        await addDoc(usersCollection, {
          displayName: newUser.displayName,
          email: newUser.email,
          password: newUser.password,
          roles: newUser.roles,
          status: newUser.status,
        });
        toast.success("Pengguna berhasil ditambahkan.");
        get().fetchUsers();
        set({ newUser: { displayName: "", email: "", password: "", roles: "Teknisi", status: "Aktif" } });
      } catch (error) {
        console.error("Error adding user: ", error);
        toast.error("Gagal menambahkan pengguna.");
      }
    }
  },

  updateUser: async () => {
    const { editingUser, newUser } = get();
    if (editingUser && newUser.displayName && newUser.email && newUser.roles) {
      try {
        const userRef = doc(db, "users", editingUser.id);
        await updateDoc(userRef, {
          displayName: newUser.displayName,
          email: newUser.email,
          roles: newUser.roles,
          status: newUser.status,
        });
        toast.success("Pengguna berhasil diperbarui.");
        get().fetchUsers();
        set({ editingUser: null, newUser: { displayName: "", email: "", password: "", roles: "Teknisi", status: "Aktif" } });
      } catch (error) {
        console.error("Error updating user: ", error);
        toast.error("Gagal memperbarui pengguna.");
      }
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      toast.success("Pengguna berhasil dihapus.");
      get().fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("Gagal menghapus pengguna.");
    }
  },

  setEditingUser: (user: UserData | null) => set({ editingUser: user }),
  setNewUser: (user: Partial<UserData>) => set({ newUser: { ...get().newUser, ...user } }),
}));
