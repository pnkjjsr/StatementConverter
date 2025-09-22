
"use client";

import Link from "next/link";
import { Menu, FileText, User, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { AuthModal } from "./AuthModal";
import { PricingModal } from "./PricingModal";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("login");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Close modal on successful login/signup
      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    }) ?? { data: { subscription: null } };

    // Check initial session
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription?.unsubscribe();
    };
  }, []);

  const handleAuthModalOpen = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  }

  const handlePricingModalOpen = () => {
    setIsPricingModalOpen(true);
    setIsMobileMenuOpen(false);
  }

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? '?';

  const authLinks = (
    <>
      <button onClick={handlePricingModalOpen} className="text-gray-600 hover:text-primary transition-colors">Pricing</button>
      <button onClick={() => handleAuthModalOpen("login")} className="text-gray-600 hover:text-primary transition-colors">Login</button>
      <button onClick={() => handleAuthModalOpen("signup")} className={cn("px-4 py-2 text-sm text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors")}>Sign Up</button>
    </>
  );

  const userMenu = (
    <div className="flex items-center gap-4">
      <button onClick={handlePricingModalOpen} className="hidden sm:block text-gray-600 hover:text-primary transition-colors">Pricing</button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none rounded-full">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="font-normal">
              <p className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen}
        initialView={authModalView}
      />
      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
      <header className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-[1280px]">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-semibold text-gray-800">
            <FileText className="h-8 w-8 text-primary" />
            <span className="font-bold">Bank Statement Converter</span>
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
                  <button onClick={handlePricingModalOpen} className="text-gray-600 hover:text-primary transition-colors py-2">Pricing</button>
                  {user ? (
                    <>
                      <button onClick={handleLogout} className="text-gray-600 text-left hover:text-primary transition-colors py-2">Logout</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleAuthModalOpen("login")} className="text-gray-600 text-left hover:text-primary transition-colors py-2">Login</button>
                      <button onClick={() => handleAuthModalOpen("signup")} className="text-center px-4 py-2 text-sm text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors">Sign Up</button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? userMenu : authLinks}
          </div>
        </div>
      </header>
    </>
  );
}
