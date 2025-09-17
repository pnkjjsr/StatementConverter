
"use client";

import Link from "next/link";
import { Menu, FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = (
    <>
      <a href="#" className="text-gray-600 hover:text-primary transition-colors">Pricing</a>
      <a href="#" className="text-gray-600 hover:text-primary transition-colors">Login</a>
      <a href="#" className={cn("px-4 py-2 text-sm text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors")}>Sign Up</a>
    </>
  );

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-[1280px]">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-semibold text-gray-800">
          <FileText className="h-8 w-8 text-primary" />
          <span className="font-bold">Statement Bank Converter</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="text-gray-600 focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
              <div className="flex flex-col space-y-3 px-2 pt-4 pb-2">
                <a href="#" className="text-gray-600 hover:text-primary transition-colors py-2">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors py-2">Login</a>
                <a href="#" className="text-center px-4 py-2 text-sm text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors">Sign Up</a>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks}
        </div>
      </div>
    </header>
  );
}
