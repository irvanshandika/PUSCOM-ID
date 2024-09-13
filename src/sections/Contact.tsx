import React from "react";

function CTASection() {
  return (
    <>
      <section id="contact" className="py-16 bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Hubungi Kami</h2>
          <p className="text-gray-600 mb-8">Butuh bantuan? Hubungi kami untuk layanan terbaik.</p>
          <a href="mailto:info@yourwebsite.com" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all">
            {" "}
            Kirim Email{" "}
          </a>
        </div>
      </section>
    </>
  );
}

export default CTASection;
