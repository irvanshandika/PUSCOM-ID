/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader, Image, Button, Tabs, Tab, Chip } from "@nextui-org/react";
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from "lucide-react";

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

type ProductDetailProps = {
  product: Product;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

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
          <p className="mb-4">{product.description}</p>
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

      <Tabs aria-label="Informasi Produk" className="mt-8">
        <Tab key="specifications" title="Spesifikasi">
          <Card>
            <CardBody>
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-b-0">
                      <td className="py-2 font-semibold">{key}</td>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="reviews" title="Ulasan">
          <Card>
            <CardBody>
              {product.reviews.map((review) => (
                <div key={review.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{review.user}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} size={16} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{review.date}</p>
                  <p>{review.comment}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
