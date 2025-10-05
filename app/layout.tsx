import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Merch KE - Tech Swags",
  description: "Your destination for premium tech merchandise and swag",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
