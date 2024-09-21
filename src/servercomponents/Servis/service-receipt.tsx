import React, { useRef } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@nextui-org/react";
import { Printer, Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ServiceReceiptProps {
  queueNumber: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  deviceType: string;
  brand: string;
  model: string;
  problemDescription: string;
  entryDate: string;
  estimatedCompletionDate?: string;
}

export default function ServiceReceipt({ 
  queueNumber, 
  customerName, 
  phoneNumber, 
  email, 
  deviceType, 
  brand, 
  model, 
  problemDescription, 
  entryDate,
  estimatedCompletionDate 
}: ServiceReceiptProps) {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (receiptRef.current) {
      html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('service_receipt.pdf');
      });
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #service-receipt, #service-receipt * {
            visibility: visible;
          }
          #service-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div ref={receiptRef}>
        <Card className="max-w-md mx-auto" id="service-receipt">
          <CardHeader className="flex flex-col items-center bg-primary text-white">
            <h2 className="text-2xl font-bold">PUSCOM Service Center</h2>
            <p className="text-lg">Struk Antrian Servis</p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">Nomor Antrian</p>
              <p className="text-4xl font-bold">{queueNumber}</p>
            </div>
            <Divider />
            <div>
              <p className="font-semibold">Nama Pelanggan:</p>
              <p>{customerName}</p>
            </div>
            <div>
              <p className="font-semibold">Nomor Telepon:</p>
              <p>{phoneNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{email}</p>
            </div>
            <Divider />
            <div>
              <p className="font-semibold">Jenis Perangkat:</p>
              <p>{deviceType}</p>
            </div>
            <div>
              <p className="font-semibold">Merek:</p>
              <p>{brand}</p>
            </div>
            <div>
              <p className="font-semibold">Model:</p>
              <p>{model}</p>
            </div>
            <Divider />
            <div>
              <p className="font-semibold">Deskripsi Masalah:</p>
              <p>{problemDescription}</p>
            </div>
            <div>
              <p className="font-semibold">Tanggal Masuk:</p>
              <p>{entryDate}</p>
            </div>
            <div>
              <p className="font-semibold">Estimasi Tanggal Selesai:</p>
              <p>{estimatedCompletionDate || "Akan ditentukan oleh teknisi"}</p>
            </div>
          </CardBody>
          <CardFooter className="flex justify-between no-print">
            <Button color="primary" variant="flat" startContent={<Printer size={18} />} onClick={handlePrint}>
              Cetak Struk
            </Button>
            <Button color="secondary" variant="flat" startContent={<Download size={18} />} onClick={handleDownload}>
              Unduh PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}