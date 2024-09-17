import React from "react";
import { Button, Input, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Send } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="text-center mb-16 mt-[20vh]">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Bangun PC Impian Anda dengan AI</h1>
      <p className="text-xl text-gray-600 mb-8">Dapatkan rekomendasi komponen yang dipersonalisasi dengan kecerdasan buatan</p>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <h2 className="text-lg font-bold">Tanyakan AI untuk Saran Komponen</h2>
          <p className="text-small text-default-500">Jelaskan kebutuhan Anda dan dapatkan rekomendasi instan</p>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input type="text" placeholder="Contoh: Saya butuh PC gaming untuk streaming 4K" className="flex-grow" />
            <Button type="submit" color="primary" endContent={<Send className="h-10 w-10" />}>
              Tanya AI
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
