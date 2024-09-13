import React from "react";

function Services() {
  return (
    <>
      <section id="services" className="py-16 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Layanan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Jual Beli Komputer</h3>
              <p className="text-gray-600 mb-6">Kami menyediakan berbagai jenis komputer dengan spesifikasi terbaru yang sesuai dengan kebutuhan Anda.</p>
              <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Selengkapnya &rarr;
              </a>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Servis Komputer</h3>
              <p className="text-gray-600 mb-6">Layanan perbaikan dan peningkatan performa komputer dengan tenaga ahli berpengalaman.</p>
              <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Selengkapnya &rarr;
              </a>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Spare Part Terlengkap</h3>
              <p className="text-gray-600 mb-6">Temukan semua spare part komputer & laptop di satu tempat.</p>
              <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Selengkapnya &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
