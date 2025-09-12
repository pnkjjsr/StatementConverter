import { StatementConverter } from "@/components/StatementConverter";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              StatementXLS
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Convert PDF bank and credit card statements to CSV with one click.
            </p>
          </header>
          <StatementConverter />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StatementXLS. All rights reserved.</p>
      </footer>
    </div>
  );
}
