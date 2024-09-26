/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Button, Divider, Avatar } from "@nextui-org/react";
import { Mail, Phone, MapPin, Send, LogIn } from "lucide-react";
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
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
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

      // Simpan pesan ke Firestore
      const docRef = await addDoc(collection(db, "pesan"), {
        name,
        email,
        subject,
        status: "Baru",
        message: processedMessage,
        photoURL,
        createdAt: new Date(),
      });

      toast.success("Pesan berhasil dikirim!");

      // Reset form
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
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Hubungi Kami</h1>
      <p className="text-center mb-4">Tanggal: {currentDate}</p> {/* Display the current date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Informasi Kontak</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-6 h-6 mr-2 text-primary" />
                <p>info@puscom.id</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-6 h-6 mr-2 text-primary" />
                <p>(021) 123-4567</p>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-primary" />
                <p>Jl. Timoho No. 129, Demangan, Gondokusuman, D.I Yogyakarta</p>
              </div>
            </div>
            <Divider className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Jam Operasional</h3>
            <ul className="space-y-2">
              <li>Senin - Jumat: 09:00 - 18:00</li>
              <li>Sabtu: 10:00 - 15:00</li>
              <li>Minggu & Hari Libur: Tutup</li>
            </ul>
            <Divider className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Lokasi Kami</h3>
            <div className="relative w-full h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d349.4007264802194!2d110.39410970776972!3d-7.787919111966328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59dbbbc458a5%3A0x6307949df8d9f156!2sPusComp!5e0!3m2!1sen!2sid!4v1726939385479!5m2!1sen!2sid"
                width="600"
                height="450"
                style={{ border: "0" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </CardBody>
        </Card>

        <Card className="p-6">
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Kirim Pesan</h2>
            {isLoggedIn ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar src={photoURL} alt={name} size="lg" />
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>
                </div>
                <Input label="Subjek" placeholder="Masukkan subjek pesan" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                  <ReactQuill value={message} onChange={setMessage} modules={modules} formats={formats} />
                </div>
                <Button color="primary" isLoading={isSubmitting} type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Pesan
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold mb-4">Anda perlu login untuk mengirim pesan</p>
                <Button color="primary" onPress={handleLogin}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
