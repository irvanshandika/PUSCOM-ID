/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, CardFooter, Button, Pagination, Chip, Input, Select, SelectItem } from "@nextui-org/react";
import { Search, ShoppingCart, Filter } from "lucide-react";
import Image from "next/image";
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

const categories = ["Semua", "Laptop", "Storage", "Peripheral", "Monitor"];

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("search");
  const [searchTerm, setSearchTerm] = useState(queryParam || "");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const productsPerPage = 8;

  const fetchProducts = async () => {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products;
  };

  useEffect(() => {
    fetchProducts().then((products) => {
      setAllProducts(products);
    });
  }, []);

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase();

    const filtered = allProducts.filter((product) => {
      const categoryMatch = selectedCategory === "Semua" || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const searchMatch = product.name.toLowerCase().includes(lowercasedSearch) || product.description.toLowerCase().includes(lowercasedSearch);
      return categoryMatch && searchMatch;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, allProducts]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    if (searchTerm) {
      document.title = `Hasil Pencarian untuk "${searchTerm}"`;
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hasil Pencarian</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input placeholder="Cari produk..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} startContent={<Search className="text-gray-400" />} className="md:w-1/2" />
        <Select placeholder="Pilih kategori" selectedKeys={[selectedCategory]} onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)} startContent={<Filter className="text-gray-400" />} className="md:w-1/4">
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </Select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl font-semibold mb-4">Maaf, tidak ada produk yang sesuai dengan pencarian Anda.</p>
          <p className="text-gray-600">Coba cari dengan kata kunci lain atau pilih kategori yang berbeda</p>
        </div>
      ) : (
        <>
          <p className="mb-4">Ditemukan {filteredProducts.length} produk</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {currentProducts.map((product) => (
              <Card key={product.id} className="h-full">
                <CardBody className="p-0">
                  <Image src={product.image} alt={product.name} width={300} height={200} layout="responsive" className="object-cover" />
                </CardBody>
                <CardFooter className="flex flex-col items-start">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <Chip size="sm" color="primary" variant="flat" className="mb-2">
                    {product.category}
                  </Chip>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <p className="font-bold text-lg mb-2">Rp {formatPrice(product.price)}</p>
                  <Button color="primary" onClick={() => router.push(`/product/${product.id}`)} endContent={<ShoppingCart className="h-4 w-4" />}>
                    Lihat Produk
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Pagination total={Math.ceil(filteredProducts.length / productsPerPage)} page={currentPage} onChange={(page) => setCurrentPage(page)} className="flex justify-center" />
        </>
      )}
    </div>
  );
}