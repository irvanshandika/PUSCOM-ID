/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Image, Button, Tabs, Tab, Chip, Spinner } from "@nextui-org/react";
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/src/config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  specifications: { [key: string]: string };
  reviews: Array<{ id: string; user: string; rating: number; comment: string; date: string }>;
};

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { id } = useParams();

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data() as Omit<Product, "id">;
          setProduct({
            id: docSnap.id,
            ...productData,
            specifications: productData.specifications || {},
            reviews: productData.reviews || [],
          });
        } else {
          toast.error("Produk tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
        toast.error("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getShortDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 30) {
      return words.slice(0, 30).join(" ") + "...";
    }
    return description;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://cdn3d.iconscout.com/3d/premium/thumb/404-3d-icon-download-in-png-blend-fbx-gltf-file-formats--error-page-not-found-work-service-website-pack-seo-web-icons-5804852.png?f=webp"
            alt="Produk Tidak Ditemukan"
            width={300}
            height={300}
          />
          <h1 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Maaf, produk yang Anda cari tidak tersedia.</p>
          <Button color="primary" href="/" as="a">
            Kembali ke Beranda
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <Chip color="primary" variant="flat" className="mb-4">
            {product.category}
          </Chip>
          <p className="text-2xl font-bold mb-4">Rp {formatPrice(product.price)}</p>
          <pre className="whitespace-pre-wrap break-words font-sans text-sm">{showFullDescription ? product.description : getShortDescription(product.description)}</pre>
          <div className="flex justify-center items-center my-4">
            <Button variant="solid" color="default" size="sm" onClick={toggleDescription} endContent={showFullDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}>
              {showFullDescription ? "Tampilkan Sedikit" : "Tampilkan Lebih"}
            </Button>
          </div>
          <div className="flex items-center mb-4">
            <p className="mr-2">Stok:</p>
            <Chip color={product.stock > 0 ? "success" : "danger"}>{product.stock > 0 ? `${product.stock} tersedia` : "Stok Habis"}</Chip>
          </div>
          <div className="flex items-center mb-4">
            <Button size="sm" variant="flat" onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </Button>
            <span className="mx-4">{quantity}</span>
            <Button size="sm" variant="flat" onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}>
              +
            </Button>
          </div>
          <div className="flex gap-4 mb-6">
            <Button color="primary" className="flex-grow" startContent={<ShoppingCart />}>
              Tambah ke Keranjang
            </Button>
            <Button variant="bordered" isIconOnly aria-label="Tambah ke Wishlist">
              <Heart />
            </Button>
          </div>
          <Card className="mb-6">
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center">
                <Truck className="mr-2" />
                <span>Pengiriman gratis untuk pembelian di atas Rp 2.000.000</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-2" />
                <span>Garansi 2 tahun</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="mr-2" />
                <span>30 hari pengembalian</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
