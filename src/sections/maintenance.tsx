import React from "react";
import { Card, CardBody, Button, Progress } from "@nextui-org/react";
import { Settings, Clock, Mail, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="text-center space-y-6">
          <Settings className="w-16 h-16 text-primary mx-auto animate-spin" />
          <h1 className="text-3xl font-bold text-primary">Sedang Dalam Perbaikan</h1>
          <p className="text-lg text-gray-600">Mohon maaf atas ketidaknyamanannya. Kami sedang melakukan pemeliharaan untuk meningkatkan pengalaman Anda.</p>
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Clock className="w-5 h-5" />
            <span>Perkiraan waktu: 24 jam</span>
          </div>
          <Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-md" />
          <div className="space-y-4">
            <Button as={Link} href="mailto:support@techgenius.com" variant="flat" color="primary" startContent={<Mail className="w-4 h-4" />}>
              Hubungi Kami
            </Button>
            <p className="text-sm text-gray-500">Jika Anda memerlukan bantuan segera, silakan hubungi tim dukungan kami.</p>
          </div>
        </CardBody>
      </Card>
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Apa yang sedang kami kerjakan?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold">Perbaikan Bug</h3>
              <p className="text-sm text-gray-600">Memperbaiki masalah yang dilaporkan oleh pengguna</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Settings className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Peningkatan Sistem</h3>
              <p className="text-sm text-gray-600">Meningkatkan kecepatan dan keamanan website</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Mail className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold">Fitur Baru</h3>
              <p className="text-sm text-gray-600">Menambahkan fitur yang Anda minta</p>
            </CardBody>
          </Card>
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2024 PUSCOM. Hak Cipta Dilindungi.</p>
        <p>Terima kasih atas kesabaran dan pengertian Anda.</p>
      </footer>
    </div>
  );
}
