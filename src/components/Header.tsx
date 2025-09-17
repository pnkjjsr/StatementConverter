
"use client";

import Link from "next/link";
import { Globe, Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <a href="#" className="text-gray-600 hover:text-primary transition-colors">Pricing</a>
      <a href="#" className="text-gray-600 hover:text-primary transition-colors">Login</a>
      <a href="#" className={cn("px-4 py-2 text-sm text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors")}>Sign Up</a>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0">
            <Globe className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>English</DropdownMenuItem>
          <DropdownMenuItem>Español</DropdownMenuItem>
          <DropdownMenuItem>Français</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <header className="container mx-auto px-6 py-6 relative z-10 max-w-[1280px]">
       <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-semibold text-gray-800">
          <span className="font-bold">Statement Bank Converter</span>
          <span className="text-primary">.</span>
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
