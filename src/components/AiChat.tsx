/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Textarea, SelectItem, Select } from "@nextui-org/react";
import { Bot, Send } from "lucide-react";
import MarkdownIt from "markdown-it";
import { startChat } from "@/src/utils/googleAI"; // Your Google Gemini AI setup
import { motion } from "framer-motion";
import Link from "next/link";

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
          {/* <ModalHeader className="flex flex-col gap-1">
            
          </ModalHeader> */}
          <ModalBody>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center w-full">
                <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
                  <Link className="inline-block mb-4 flex-none focus:outline-none focus:opacity-80" href="/" aria-label="PUSCOM ID">
                    <span className="w-28 h-auto mx-auto text-blue-800 font-bold">PUSCOM</span>
                  </Link>

                  <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">Welcome to Jackie AI</h1>
                  <p className="mt-3 text-gray-600 dark:text-neutral-400">Your AI-powered copilot for the web</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <div key={index}>
                  <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-center gap-2 ${message.isUser ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                        {message.isUser ? (
                          <>
                            <span className="shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
                              <span className="text-sm font-medium text-white leading-none">AZ</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <svg className="shrink-0 size-[38px] rounded-full" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="38" height="38" rx="6" fill="#2563EB" />
                              <path d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25" stroke="white" strokeWidth="1.5" />
                              <path d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25" stroke="white" strokeWidth="1.5" />
                              <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white" />
                            </svg>
                          </>
                        )}
                      </div>
                      <div className={`p-3 max-w-md ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} rounded-lg`}>
                        <div dangerouslySetInnerHTML={{ __html: md.render(message.text) }} />
                      </div>
                    </div>
                  </div>
                </div>
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
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Ketik pesan Anda di sini..."></textarea>

              <div className="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-white dark:bg-neutral-900">
                <div className="flex justify-between items-center">
                  <div className="flex items-center" />

                  <div className="flex items-center gap-x-1">
                    <button type="button" onClick={handleSendMessage} className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:bg-blue-500">
                      <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
