import React from "react";

function Hero() {
  return (
    <>
      <section
        className="flex items-center justify-center h-screen text-white"
        style={{ backgroundImage: "url('https://unsplash.com/photos/fMntI8HAAB8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c2VydmljZXxlbnwwfHx8fDE3MjYxMjU4OTh8MA&force=true')", backgroundSize: "cover", backgroundPosition: "top" }}>
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Komputer Terbaik untuk Kebutuhan Anda</h1>
          <p className="text-lg md:text-xl mb-8">Jual beli komputer, layanan servis, dan solusi teknologi terbaik.</p>
          <a href="#services" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all">
            {" "}
            Temukan Layanan Kami{" "}
          </a>
        </div>
      </section>
    </>
  );
}

export default Hero;
