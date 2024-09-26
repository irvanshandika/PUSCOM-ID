/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/src/config/FirebaseConfig";
import { toast } from "react-hot-toast";

interface SignInState {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  signInWithEmail: (router: any) => Promise<void>;
  signInWithGoogle: (router: any) => Promise<void>;
}

const auth = getAuth(app);
const db = getFirestore(app);

const checkUserInDatabase = async (uid: string): Promise<{ exists: boolean; displayName?: string; signType?: string }> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return { exists: true, displayName: userData.displayName, signType: userData.signType };
  }
  return { exists: false };
};

export const useSignInStore = create<SignInState>((set) => ({
  email: "",
  password: "",
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  
  signInWithEmail: async (router) => {
    const { email, password } = useSignInStore.getState();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const { exists, displayName, signType } = await checkUserInDatabase(user.uid);
      if (!exists) {
        await auth.signOut();
        toast.error(`Maaf, akun ${email} belum terdaftar.`);
        return;
      }

      if (signType !== "credential") {
        await auth.signOut();
        toast.error("Akun ini terdaftar dengan metode lain. Silakan gunakan metode sign in yang sesuai.");
        return;
      }

      toast.success(`Selamat Datang Kembali ${displayName}`);
      router.push("/");
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error("Email atau password salah. Silakan coba lagi.");
    }
  },

  signInWithGoogle: async (router) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const { exists, displayName, signType } = await checkUserInDatabase(user.uid);
      if (!exists) {
        await auth.signOut();
        toast.error(`Maaf, akun ${user.email} belum terdaftar.`);
        return;
      }

      if (signType !== "google") {
        await auth.signOut();
        toast.error("Akun ini terdaftar dengan metode lain. Silakan gunakan metode sign in yang sesuai.");
        return;
      }

      toast.success(`Selamat Datang Kembali ${displayName}`);
      router.push("/");
    } catch (error) {
      console.error("Error during Google sign in:", error);
      toast.error("Terjadi kesalahan saat masuk dengan Google. Silakan coba lagi.");
    }
  },
}));
