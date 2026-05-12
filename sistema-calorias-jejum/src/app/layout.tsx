import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// Configurando a fonte do Google
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Registro de Calorias e Jejum",
  description: "Acompanhamento de consumo calórico e jejum intermitente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        {/* Envolva os children com o AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}