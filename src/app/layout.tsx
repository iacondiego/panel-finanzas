import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: "Panel de Finanzas | Dashboard Profesional",
    description: "Panel de finanzas profesional conectado en tiempo real a Google Sheets",
    keywords: ["finanzas", "dashboard", "google sheets", "analytics"],
    authors: [{ name: "Tu Nombre" }],
    viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
