import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundImage from "./backgroundImage";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeMineX Operations Dashboard",
  description: "Portal used to manage WeMineX hosting farms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackgroundImage />
        {children}
      </body>
    </html>
  );
}
