'use client'
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Image, Button, Pagination, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Search, ShoppingCart } from "lucide-react";
import { db } from "@/src/config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

const productCategories = [
  { label: "Semua Kategori", value: "all" },
  { label: "Laptop", value: "laptop" },
  { label: "Spare Part", value: "spare_part" },
  { label: "Penyimpanan", value: "storage" },
  { label: "Periferal", value: "peripheral" },
];

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const rowsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products: ", error);
        toast.error("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "all" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredProducts.slice(start, end);
  }, [page, filteredProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Katalog Produk</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          placeholder="Cari produk..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          startContent={<Search className="text-gray-400" />} 
          className="md:w-1/2" 
        />
        <Select 
          placeholder="Pilih kategori" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="md:w-1/4"
        >
          {productCategories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {items.map((product) => (
          <Card key={product.id} className="w-full">
            <CardBody className="p-0 flex justify-center items-center">
              <Image 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover" 
              />
            </CardBody>
            <CardFooter className="flex flex-col items-start">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-default-500 text-sm mb-2">{product.category}</p>
              <p className="font-bold text-lg mb-2">Rp {formatPrice(product.price)}</p>
              <p className="text-sm mb-2">Stok: {product.stock}</p>
              <Button 
                color="primary" 
                endContent={<ShoppingCart className="h-4 w-4" />}
                onClick={() => router.push(`/product/${product.id}`)}
              >
                Lihat Produk
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Pagination 
          total={pages} 
          page={page} 
          onChange={(page) => setPage(page)} 
        />
      </div>
    </div>
  );
}