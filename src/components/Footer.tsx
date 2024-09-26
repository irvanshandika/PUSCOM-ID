import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">© {new Date().getFullYear()} PUSCOM ID. Hak cipta dilindungi undang-undang.</p>
      </div>
    </footer>
  );
}
