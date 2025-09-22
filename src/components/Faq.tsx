// src/components/Faq.tsx
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimatedSection } from './AnimatedSection';

const faqItems = [
  {
    question: 'How does the AI conversion work?',
    answer:
      "Our system uses advanced AI models (similar to those used in OCR and data extraction) to intelligently identify and extract tabular data from your PDF. It understands the layout of various bank statements, separates columns correctly, and formats the data into a clean, usable CSV file.",
  },
  {
    question: 'Is my financial data safe?',
    answer:
      "Yes. Security is our top priority. We process your file in-memory and never save it to our servers. Your document is deleted the moment your browser session ends. The entire process is automated, with no human intervention. Read our full Privacy Policy for more details.",
  },
  {
    question: 'What types of files can I upload?',
    answer:
      'Currently, our service is optimized for PDF bank and credit card statements. We are working on support for other formats like JPG and PNG for scanned documents in the near future.',
  },
  {
    question: 'What happens if the conversion is not accurate?',
    answer:
      "While our AI is highly accurate, complex or unusual PDF formats can sometimes pose a challenge. If you're not satisfied with a conversion, please contact us. We are constantly improving our algorithms and customer feedback is invaluable.",
  },
  {
    question: 'Is there a limit to the file size or number of pages?',
    answer:
      'For anonymous users, there is a limit of 1 page per conversion. Registered and Subscriber plans have higher limits. For performance reasons, we recommend files under 10MB, though larger files may work.',
  },
  {
    question: 'Do I need to install any software?',
    answer:
      'No. StatementXLS is a fully web-based tool. All you need is a modern web browser. There is nothing to download or install.',
  },
];

export function Faq() {
  return (
    <AnimatedSection
      className="max-w-4xl mx-auto py-16 px-4 relative z-10"
      delay={0.6}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="bg-gray-900/5 backdrop-blur-sm border border-black/10 rounded-xl faq-accordion-item"
          >
            <AccordionTrigger className="text-left font-semibold p-6 text-gray-800 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 text-gray-600">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </AnimatedSection>
  );
}
