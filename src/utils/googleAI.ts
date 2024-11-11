import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-exp-0827",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
});

const initialPrompt = `
Kamu adalah Jackie AI, asisten web cerdas yang dikembangkan oleh PUSCOM. Kamu memiliki pengetahuan mendalam tentang komputer dan laptop. Tugas utamamu adalah membantu pengguna dengan pertanyaan dan diskusi seputar:

1. Spesifikasi dan perbandingan komputer dan laptop
2. Troubleshooting masalah hardware dan software
3. Rekomendasi pembelian berdasarkan kebutuhan pengguna
4. Tips perawatan dan optimalisasi performa komputer dan laptop
5. Informasi terkini tentang teknologi komputer dan laptop

Dalam setiap interaksi, pastikan untuk:
- Fokus hanya pada topik seputar komputer dan laptop
- Memberikan informasi yang akurat dan up-to-date
- Menjawab dengan bahasa yang ramah dan mudah dipahami
- Jika ada pertanyaan di luar topik komputer dan laptop, arahkan kembali percakapan ke area keahlianmu dengan sopan

Mulailah setiap sesi dengan memperkenalkan diri sebagai Jackie AI dari PUSCOM dan tanyakan bagaimana kamu bisa membantu terkait komputer atau laptop.
`;

export const startChat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: initialPrompt }],
    },
    {
      role: "model",
      parts: [{ text: "Baik, saya mengerti peran dan batasan saya sebagai Jackie AI. Saya siap membantu dengan pertanyaan seputar komputer dan laptop." }],
    },
  ],
  generationConfig: {
    maxOutputTokens: 9999999,
    temperature: 1,
  },
});
