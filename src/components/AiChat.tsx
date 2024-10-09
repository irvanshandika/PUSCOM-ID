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
                            <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                              <span className="flex size-8 items-center justify-center rounded-full bg-black text-neutral-100 dark:bg-white dark:text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="size-5">
                                  <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135" />
                                  <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5" />
                                </svg>
                              </span>
                            </div>
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
                    <button
                      type="button"
                      className="ml-auto flex cursor-pointer items-center gap-2 whitespace-nowrap bg-black px-4 py-2 text-center text-xs font-medium tracking-wide text-neutral-100 transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:opacity-100 active:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-white dark:text-black dark:focus-visible:outline-white rounded-md"
                      onClick={handleSendMessage}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Generate
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
