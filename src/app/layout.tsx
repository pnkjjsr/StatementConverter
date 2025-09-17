import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { FogAnimation } from "@/components/FogAnimation";

export const metadata: Metadata = {
  title: "Statement Bank Converter",
  description: "Convert PDF bank and credit card statements to Excel with one click.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased")}>
        <div className="relative min-h-screen w-full flex-col overflow-hidden">
          <FogAnimation />
          
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
