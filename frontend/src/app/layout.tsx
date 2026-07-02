import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer } from "@/components/ui/Toast";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Belezza - Marketplace de Beleza",
  description: "Encontre e agende horários com os melhores profissionais de beleza.",
};

import { BottomNavigation } from "@/components/layout/BottomNavigation";

import { AppInitializer } from "@/components/shared/AppInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body>
        <AppInitializer />
        {children}
        <BottomNavigation />
        <ToastContainer />
      </body>
    </html>
  );
}
