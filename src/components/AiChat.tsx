/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
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

  // Modify the prompt to direct the AI towards computer-related topics
  const buildPrompt = (input: string) => {
    const basePrompt = `You are Jackie AI, an expert assistant in computers and laptops, helping users with buying, troubleshooting, and understanding specs of computing devices.`;
    return `${basePrompt}\n\nUser: ${input}`;
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      setIsLoading(true);

      try {
        // Handle specific greeting cases like "Halo Jackie"
        if (/halo jackie/i.test(inputMessage)) {
          setMessages((prev) => [...prev, { text: "Halo! Saya Jackie, asisten Anda untuk semua hal tentang komputer dan laptop. Ada yang bisa saya bantu?", isUser: false }]);
          setIsLoading(false);
          return;
        }

        // Modify the prompt for computer-related context
        const prompt = buildPrompt(inputMessage);
        const result = await startChat.sendMessageStream(prompt);

        const buffer: string[] = [];
        for await (const response of result.stream) {
          buffer.push(response.text());
        }

        // Render the AI's response
        setMessages((prev) => [...prev, { text: md.render(buffer.join("")), isUser: false }]);
      } catch (error) {
        setMessages((prev) => [...prev, { text: "Terjadi kesalahan dalam mendapatkan respons dari AI.", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">Chat dengan Asisten Jackie AI</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    <div dangerouslySetInnerHTML={{ __html: message.text }} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800">
                    <LoadingDots />
                  </div>
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
