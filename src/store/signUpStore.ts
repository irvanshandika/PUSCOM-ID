import { create } from "zustand";

interface SignUpState {
  displayName: string;
  email: string;
  password: string;
  setDisplayName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export const useSignUpStore = create<SignUpState>((set) => ({
  displayName: "",
  email: "",
  password: "",
  setDisplayName: (name) => set({ displayName: name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
}));
