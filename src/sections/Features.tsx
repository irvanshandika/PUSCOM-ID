import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";

const features = [
  {
    title: "Kualitas Terjamin",
    desc: "Produk berkualitas tinggi dari merek terpercaya",
    img: "https://cdn3d.iconscout.com/3d/premium/thumb/quality-3d-icon-download-in-png-blend-fbx-gltf-file-formats--line-logo-certificate-guarantee-approval-product-marketing-pack-business-icons-9590352.png?f=webp",
  },
  {
    title: "Harga Kompetitif",
    desc: "Penawaran terbaik untuk setiap anggaran",
    img: "https://cdn3d.iconscout.com/3d/premium/thumb/price-compare-3d-icon-download-in-png-blend-fbx-gltf-file-formats--matching-comparision-balance-black-friday-pack-festival-days-icons-5429738.png?f=webp",
  },
  {
    title: "Dukungan Teknis",
    desc: "Tim ahli siap membantu Anda 24/7",
    img: "https://cdn3d.iconscout.com/3d/premium/thumb/customer-service-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--helpline-support-helpdesk-pack-tech-illustrations-4497573.png?f=webp",
  },
];

export default function FeaturesSection() {
  return (
    <section className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Mengapa Memilih PUSCOM?</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow px-[-20px]">
              <CardHeader className="flex justify-center">
                <Image src={item.img} alt={item.title} className="w-40 h-w-40" width={0} height={0} />
              </CardHeader>
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
