import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="mb-4">© {year} Nama Perusahaan Anda. Semua Hak Dilindungi.</p>
          <a href="/" className="text-blue-400 hover:text-blue-500">
            Kebijakan Privasi
          </a>
        </div>
      </footer>
    </>
  );
}

export default Footer;
