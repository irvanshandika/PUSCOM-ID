import React from "react";
import { Card, CardBody } from "@nextui-org/react";

const features = [
  { title: "Kualitas Terjamin", desc: "Produk berkualitas tinggi dari merek terpercaya" },
  { title: "Harga Kompetitif", desc: "Penawaran terbaik untuk setiap anggaran" },
  { title: "Dukungan Teknis", desc: "Tim ahli siap membantu Anda 24/7" },
];

export default function FeaturesSection() {
  return (
    <section className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Mengapa Memilih PUSCOM?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}