import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToxicDetect AI - Indonesian Toxicity Analysis & Detection",
  description: "Deteksi teks toksik bahasa Indonesia menggunakan model IndoBERT & IndoBERTweet serta analitik dataset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
