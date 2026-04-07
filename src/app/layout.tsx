import type { Metadata } from "next";
import SyncUser from "../components/SyncUser";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ConvexClient } from "convex/browser";
import ConvexClientProvider from "../components/ConvexClientProvider";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nyayak",
  description: "Your Next.js + Clerk App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased`}>
        <ConvexClientProvider>
          <SyncUser />
          <NavBar />
          {children}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
