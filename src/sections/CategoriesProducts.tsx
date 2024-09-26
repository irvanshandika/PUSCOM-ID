import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Monitor, Cpu, HardDrive, Headphones } from "lucide-react";

const categories = [
  { icon: <Monitor />, title: "Laptop & Desktop" },
  { icon: <Cpu />, title: "Komponen" },
  { icon: <HardDrive />, title: "Penyimpanan" },
  { icon: <Headphones />, title: "Aksesoris" },
];

export default function CategoryProducts() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {categories.map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardBody className="flex flex-col items-center text-center p-6">
            <div className="text-primary mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
          </CardBody>
        </Card>
      ))}
    </section>
  );
}