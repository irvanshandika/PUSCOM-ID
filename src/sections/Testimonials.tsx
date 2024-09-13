import React from "react";

function Testimonials() {
  return (
    <>
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Apa Kata Mereka?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 shadow-md rounded-lg">
              <p className="text-gray-700 mb-4">“Layanan yang luar biasa! Komputer saya seperti baru lagi setelah diservis di sini.”</p>
              <h4 className="font-semibold">- Budi Santoso</h4>
            </div>
            <div className="p-6 shadow-md rounded-lg">
              <p className="text-gray-700 mb-4">“Membeli komputer di sini adalah keputusan terbaik. Harga terjangkau dan kualitas terjamin.”</p>
              <h4 className="font-semibold">- Ani Wiryani</h4>
            </div>
            <div className="p-6 shadow-md rounded-lg">
              <p className="text-gray-700 mb-4">“Mereka membantu saya dengan solusi jaringan yang efisien dan cepat untuk bisnis saya.”</p>
              <h4 className="font-semibold">- Rudi Hartono</h4>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonials;
