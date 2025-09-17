
import { Features } from "@/components/Features";
import { Header } from "@/components/Header";
import { StatementConverter } from "@/components/StatementConverter";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-4 relative z-10">
        <AnimatedSection className="w-full max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Convert Your Bank Statements to <span className="text-primary">Excel</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Effortlessly extract tables from PDF statements and export them to a clean CSV file with one click.
          </p>
          <StatementConverter />
        </AnimatedSection>
        <Features />
        <Pricing />
        <Contact />
      </main>
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
    </>
  );
}
