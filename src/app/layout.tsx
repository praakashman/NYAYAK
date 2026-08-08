import type { Metadata } from "next";
import SyncUser from "../components/SyncUser";
import "./globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ConvexClient } from "convex/browser";
import ConvexClientProvider from "../components/ConvexClientProvider";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
      <body className="font-sans antialiased">
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
