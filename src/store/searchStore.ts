import { create } from "zustand";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/src/config/FirebaseConfig";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

type ProductStore = {
  allProducts: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  fetchProducts: () => Promise<void>;
  filterProducts: () => void;
};

const useProductStore = create<ProductStore>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  searchTerm: "",
  selectedCategory: "Semua",
  currentPage: 1,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCurrentPage: (page) => set({ currentPage: page }),
  fetchProducts: async () => {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    set({ allProducts: products });
  },
  filterProducts: () => {
    const { allProducts, searchTerm, selectedCategory } = get();
    const lowercasedSearch = searchTerm.toLowerCase();

    const filtered = allProducts.filter((product) => {
      const categoryMatch = selectedCategory === "Semua" || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const searchMatch = product.name.toLowerCase().includes(lowercasedSearch) || product.description.toLowerCase().includes(lowercasedSearch);
      return categoryMatch && searchMatch;
    });

    set({ filteredProducts: filtered, currentPage: 1 });
  },
}));

export default useProductStore;
