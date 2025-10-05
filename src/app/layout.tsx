import Providers from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Web3 App",
  description: "NFT management application built with Next.js and Web3",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getTheme = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("theme")?.value || "dark";
  };
  const defaultTheme = await getTheme();

  return (
    <html lang="en" className={defaultTheme} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
