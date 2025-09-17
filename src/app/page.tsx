
import { Features } from "@/components/Features";
import { StatementConverter } from "@/components/StatementConverter";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Home() {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center p-4 relative z-10">
        <AnimatedSection className="w-full max-w-2xl text-center pt-12" delay={0}>
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
      </div>
    </>
  );
}
