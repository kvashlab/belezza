import type { Metadata } from "next";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer } from "@/components/ui/Toast";

const fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Belezza - Marketplace de Beleza",
  description: "Encontre e agende horários com os melhores profissionais de beleza.",
};

import { BottomNavigation } from "@/components/layout/BottomNavigation";

import { AppInitializer } from "@/components/shared/AppInitializer";
import { SocketProvider } from "@/providers/SocketProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SocketProvider>
          <AppInitializer />
          {children}
          <BottomNavigation />
          <ToastContainer />
        </SocketProvider>
      </body>
    </html>
  );
}
