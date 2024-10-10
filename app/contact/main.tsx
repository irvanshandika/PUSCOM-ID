/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Button, Divider, Avatar } from "@nextui-org/react";
import { Mail, Phone, MapPin, Send, LogIn, Clock, Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/src/config/FirebaseConfig";
import { toast } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.displayName || "");
          setEmail(userData.email || "");
          setPhotoURL(userData.photoURL || "");
        }
      } else {
        setIsLoggedIn(false);
        setName("");
        setEmail("");
        setPhotoURL("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const processQuillContent = async (content: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        return doc.body.innerHTML;
      };

      const processedMessage = await processQuillContent(message);

      await addDoc(collection(db, "pesan"), {
        name,
        email,
        subject,
        status: "Baru",
        message: processedMessage,
        photoURL,
        createdAt: new Date(),
      });

      toast.success("Pesan berhasil dikirim!");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]],
  };

  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "image"];

  const handleLogin = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">Hubungi Kami</h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">Kami siap membantu Anda. Jangan ragu untuk menghubungi kami kapan saja.</p>
          <div className="mt-4 flex justify-center items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Card className="bg-white shadow-xl">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Email</p>
                    <p className="mt-1 text-gray-500">info@puscom.id</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Telepon</p>
                    <p className="mt-1 text-gray-500">(021) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Alamat</p>
                    <p className="mt-1 text-gray-500">Jl. Timoho No. 129, Demangan, Gondokusuman, D.I Yogyakarta</p>
                  </div>
                </div>
              </div>

              <Divider className="my-8" />

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Jam Operasional</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Senin - Jumat: 09:00 - 18:00</span>
                </li>
                <li className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Sabtu: 10:00 - 15:00</span>
                </li>
                <li className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Minggu & Hari Libur: Tutup</span>
                </li>
              </ul>

              <Divider className="my-8" />

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lokasi Kami</h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.018597497584!2d110.3917018745541!3d-7.787852477282271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59dbbbc458a5%3A0x6307949df8d9f156!2sPusComp!5e0!3m2!1sen!2sid!4v1728467816636!5m2!1sen!2sid"
                  width="600"
                  height="450"
                  style={{ border: "0" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
              {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <Avatar src={photoURL} alt={name} className="w-20 h-20 text-large" />
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-semibold text-gray-900">{name}</p>
                      <p className="text-gray-600">{email}</p>
                    </div>
                  </div>
                  <Input label="Subjek" placeholder="Masukkan subjek pesan" value={subject} onChange={(e) => setSubject(e.target.value)} required className="max-w-full" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                    <ReactQuill value={message} onChange={setMessage} modules={modules} formats={formats} className="h-48 mb-12" />
                  </div>
                  <Button color="primary" size="lg" isLoading={isSubmitting} type="submit" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Kirim Pesan
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-900 mb-4">Anda perlu login untuk mengirim pesan</p>
                  <Button color="primary" size="lg" onPress={handleLogin} className="mt-4">
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
