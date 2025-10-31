import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"]
}) 

export const metadata: Metadata = {
  title: "Medical Chat",
  description: "RAG chatbot that provides medical assistance from WHO guidelines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <Navbar />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
