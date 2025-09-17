import { Header } from "@/components/Header";
import { StatementConverter } from "@/components/StatementConverter";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex-col bg-background overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-64 wave-bg -z-10 opacity-70"></div>
      <div className="absolute inset-x-0 top-0 h-64 wave-bg-top -z-10 opacity-70"></div>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Convert Your Bank Statements to <span className="text-primary">Excel</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Effortlessly extract tables from PDF statements and export them to a clean CSV file with one click.
          </p>
          <StatementConverter />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground relative z-10">
        <p>&copy; {new Date().getFullYear()} Statement Bank Converter. All rights reserved.</p>
      </footer>
    </div>
  );
}
