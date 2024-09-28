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
  currentPage: number;
  selectedCategory: string;
  searchTerm: string;
  productsPerPage: number;
  fetchProducts: () => Promise<void>;
  filterProducts: () => void;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  currentPage: 1,
  selectedCategory: "Semua",
  searchTerm: "",
  productsPerPage: 8,

  // Fetch products from Firebase
  fetchProducts: async () => {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    set({ allProducts: products });
    get().filterProducts();
  },

  // Filter products based on search term and category
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

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setCategory: (category: string) => set({ selectedCategory: category }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
}));
