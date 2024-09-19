/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Textarea, SelectItem, Select } from "@nextui-org/react";
import { Bot, Send } from "lucide-react";
import MarkdownIt from "markdown-it";
import { startChat } from "@/src/utils/googleAI"; // Your Google Gemini AI setup
import { motion } from "framer-motion";

const LoadingDots = () => {
  return (
    <span className="flex">
      Generate
      <motion.span
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.6,
          delay: 0.1,
        }}>
        .
      </motion.span>
      <motion.span
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.6,
          delay: 0.2,
        }}>
        .
      </motion.span>
      <motion.span
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.6,
          delay: 0.3,
        }}>
        .
      </motion.span>
    </span>
  );
};

const md = new MarkdownIt();
const promptOptions = [
  { value: "spec", label: "Spesifikasi Laptop", text: "Bisakah Anda merekomendasikan spesifikasi laptop untuk pekerjaan desain grafis?" },
  { value: "troubleshoot", label: "Troubleshooting", text: "Laptop saya tiba-tiba mati dan tidak mau menyala. Apa yang harus saya lakukan?" },
  { value: "compare", label: "Perbandingan", text: "Tolong bandingkan performa antara prosesor Intel Core i7 generasi ke-11 dan AMD Ryzen 7 5800H." },
];

export default function AIChatModal() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const chatStartedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !chatStartedRef.current) {
      setMessages([
        {
          text: "Halo! Saya Jackie AI dari PUSCOM, asisten web cerdas yang siap membantu Anda dengan segala hal seputar komputer dan laptop. Ada yang bisa saya bantu?",
          isUser: false,
        },
      ]);
      chatStartedRef.current = true;
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const chat = await startChat;
      const result = await chat.sendMessage(inputMessage);
      const response = result.response;
      const aiMessage = { text: response.text(), isUser: false };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Maaf, terjadi kesalahan. Silakan coba lagi.", isUser: false }]);
    }

    setIsLoading(false);
  };

  const handlePromptSelect = (value: string) => {
    const selectedPrompt = promptOptions.find((option) => option.value === value);
    if (selectedPrompt) {
      setInputMessage(selectedPrompt.text);
    }
  };

  return (
    <>
      <Button isIconOnly color="primary" aria-label="Chat dengan AI" className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg" onPress={onOpen}>
        <Bot size={32} />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            chatStartedRef.current = false;
            setMessages([]);
          }
          onOpenChange();
        }}
        size="2xl"
        scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">Chat dengan Asisten Jackie AI</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded-lg ${message.isUser ? "bg-primary text-white ml-auto" : "bg-gray-200 mr-auto"} max-w-[80%]`}>
                  <div dangerouslySetInnerHTML={{ __html: md.render(message.text) }} />
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <LoadingDots />
                </div>
              )}
            </div>
            <Select label="Pilih Prompt" className="mb-2" onChange={(e) => handlePromptSelect(e.target.value)}>
              {promptOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <div className="flex gap-2">
              <Textarea
                placeholder="Ketik pesan Anda di sini..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-grow"
              />
              <Button color="primary" isIconOnly onClick={handleSendMessage}>
                <Send size={20} />
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
