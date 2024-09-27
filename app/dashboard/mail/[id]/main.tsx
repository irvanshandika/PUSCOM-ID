/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Button, Textarea, Chip, Avatar, Divider } from "@nextui-org/react";
import { Calendar, Check, Reply, ArrowLeft } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/src/config/FirebaseConfig";

export default function ContactMessageDetail() {
  const router = useRouter();
  const { id } = useParams(); // Get the message ID from URL
  interface Message {
    id: string;
    name: string;
    photoURL: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
  }

  const [message, setMessage] = useState<Message | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  // Fetch message from Firestore by id
  useEffect(() => {
    const fetchMessage = async () => {
      if (typeof id === "string") {
        const docRef = doc(db, "pesan", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMessage({ id: docSnap.id, ...docSnap.data() } as Message);
        } else {
          console.error("No such document!");
        }
      }
    };

    fetchMessage();
  }, [id]);

  // Update page title with "{Nama}'s Mail"
  useEffect(() => {
    if (message) {
      document.title = `${message.name}'s Mail | PUSCOM`;
    }
  }, [message]);

  const handleMarkAsRead = async () => {
    if (message && message.status === "Baru") {
      if (typeof id === "string") {
        const messageRef = doc(db, "pesan", id);
        await updateDoc(messageRef, { status: "Dibaca" });
        setMessage((prev) => (prev ? { ...prev, status: "Dibaca" } : null));
      }
    }
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleSendReply = () => {
    console.log("Balasan terkirim:", replyMessage);
    setIsReplying(false);
    setReplyMessage("");
  };

  const formatDate = (date: any) => {
    if (date && date.toDate) {
      // Jika date adalah Firebase Timestamp, gunakan toDate()
      date = date.toDate();
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date ? new Date(date).toLocaleDateString("id-ID", options) : "Invalid Date";
  };

  if (!message) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-4 px-2 md:py-8 md:px-4">
      <Button color="primary" variant="light" startContent={<ArrowLeft />} onPress={() => router.back()} className="mb-4">
        Kembali ke Daftar Pesan
      </Button>

      <Card className="max-w-full md:max-w-3xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-start md:items-center flex-col md:flex-row">
            <Avatar src={message.photoURL} size="lg" className="mr-0 md:mr-4 mb-4 md:mb-0" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{message.subject}</h2>
              <p className="text-small text-default-500">
                {message.name} &lt;{message.email}&gt;
              </p>
            </div>
          </div>
          <Chip color={message.status === "Baru" ? "warning" : message.status === "Dibaca" ? "primary" : "success"} className="mt-4 md:mt-0">
            {message.status}
          </Chip>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex items-center mb-4 text-default-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(message.createdAt)}</span>
          </div>
          <div className="mt-6">
            <div dangerouslySetInnerHTML={{ __html: message.message }} />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <Button color="primary" variant="flat" startContent={<Check />} onPress={handleMarkAsRead} isDisabled={message.status !== "Baru"} className="mb-4 md:mb-0 w-full md:w-auto">
            Tandai Sudah Dibaca
          </Button>
          <Button color="primary" startContent={<Reply />} onPress={handleReply} className="w-full md:w-auto">
            Balas
          </Button>
        </CardFooter>
      </Card>

      {isReplying && (
        <Card className="max-w-full md:max-w-3xl mx-auto mt-4">
          <CardHeader>
            <h3 className="text-xl font-bold">Balas Pesan</h3>
          </CardHeader>
          <CardBody>
            <Textarea placeholder="Tulis balasan Anda di sini..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} minRows={5} className="w-full" />
          </CardBody>
          <CardFooter className="flex justify-end">
            <Button color="primary" onPress={handleSendReply}>
              Kirim Balasan
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
