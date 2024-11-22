import { create } from "zustand";
import { toast } from "react-hot-toast";
import { db, storage } from "@/src/config/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface EcommerceURL {
  platform: string;
  url: string;
}

interface ProductState {
  productName: string;
  category: string;
  status: string;
  price: number | null;
  stock: number | null;
  description: string;
  uploadedImage: File | null;
  imagePreview: string | null;
  isSubmitting: boolean;
  ecommerceURLs: EcommerceURL[];
  setEcommerceURLs: (urls: EcommerceURL[]) => void;
  addEcommerceURL: (platform: string, url: string) => void;
  removeEcommerceURL: (platform: string) => void;
  updateEcommerceURL: (platform: string, url: string) => void;
  setProductName: (name: string) => void;
  setCategory: (category: string) => void;
  setStatus: (status: string) => void;
  setPrice: (price: number | null) => void;
  setStock: (stock: number | null) => void;
  setDescription: (description: string) => void;
  setUploadedImage: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
  resetForm: () => void;
  handleImageUpload: (file: File) => void;
  submitProduct: () => Promise<void>;
}

const useProductStore = create<ProductState>((set, get) => ({
  productName: "",
  category: "",
  status: "",
  price: null,
  stock: null,
  description: "",
  uploadedImage: null,
  imagePreview: null,
  isSubmitting: false,
  ecommerceURLs: [],
  setEcommerceURLs: (urls) => set({ ecommerceURLs: urls }),
  addEcommerceURL: (platform, url) => {
    const current = get().ecommerceURLs;
    if (!current.find((item) => item.platform === platform)) {
      set({ ecommerceURLs: [...current, { platform, url }] });
    }
  },
  removeEcommerceURL: (platform) => {
    const current = get().ecommerceURLs;
    set({ ecommerceURLs: current.filter((item) => item.platform !== platform) });
  },
  updateEcommerceURL: (platform, url) => {
    const current = get().ecommerceURLs;
    set({
      ecommerceURLs: current.map((item) => (item.platform === platform ? { ...item, url } : item)),
    });
  },
  setProductName: (name) => set({ productName: name }),
  setCategory: (category) => set({ category }),
  setStatus: (status) => set({ status }),
  setPrice: (price) => set({ price }),
  setStock: (stock) => set({ stock }),
  setDescription: (description) => set({ description }),
  setUploadedImage: (file) => set({ uploadedImage: file }),
  setImagePreview: (preview) => set({ imagePreview: preview }),
  resetForm: () =>
    set({
      productName: "",
      category: "",
      status: "",
      price: null,
      stock: null,
      description: "",
      uploadedImage: null,
      imagePreview: null,
    }),
  handleImageUpload: (file) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maaf, Ukuran Melebihi Batas 10MB");
      return;
    }
    set({ uploadedImage: file });
    const reader = new FileReader();
    reader.onload = () => {
      set({ imagePreview: reader.result as string });
    };
    reader.readAsDataURL(file);
  },
  submitProduct: async () => {
    const { productName, category, status, price, stock, description, uploadedImage, isSubmitting } = get();
    if (isSubmitting) return;
    if (!productName || !category || !price || !status || !stock || !description || !uploadedImage) {
      toast.error("Harap lengkapi semua data!");
      return;
    }

    set({ isSubmitting: true });
    try {
      const imageRef = ref(storage, `products/${uploadedImage.name}`);
      await uploadBytes(imageRef, uploadedImage);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "products"), {
        name: productName,
        category: category,
        status: status,
        price: price,
        stock: stock,
        description: description,
        image: imageUrl,
        createdAt: new Date(),
      });

      toast.success("Produk berhasil ditambahkan!");
      get().resetForm();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan produk.");
      console.error("Error adding product: ", error);
    } finally {
      set({ isSubmitting: false });
    }
  },
}));

export default useProductStore;
