
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./AnimatedSection";

export function Contact() {
  return (
    <AnimatedSection className="max-w-6xl mx-auto py-16 px-4 relative z-10">
      <div className="bg-muted p-8 rounded-lg flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Need more?</h2>
          <p className="text-gray-600 max-w-2xl">
            We provide bespoke services for clients who have other document formats to process. Let us know how we can help!
          </p>
        </div>
        <Button size="lg">Contact Us</Button>
      </div>
    </AnimatedSection>
  );
}
