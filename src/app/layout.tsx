import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { FogAnimation } from "@/components/FogAnimation";
import { Header } from "@/components/Header";

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
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <FogAnimation />
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="w-full max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Statement Bank Converter Ltd. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                <a href="#" className="hover:text-primary transition-colors">Earn Credits</a>
                <a href="#" className="hover:text-primary transition-colors">API Docs</a>
                <a href="#" className="hover:text-primary transition-colors">About</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Blog</a>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
