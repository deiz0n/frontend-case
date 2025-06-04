import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Anka Tech Investimentos",
    description: "Gerenciamento de Clientes e Ativos",
};

export default function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
        <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <QueryProvider>
            <main className="max-w-7xl mx-auto p-6">
                {children}
            </main>
        </QueryProvider>
        </body>
        </html>
    );
}