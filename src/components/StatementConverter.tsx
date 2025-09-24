
"use client";

import { useState, useRef, useTransition, type DragEvent, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  UploadCloud,
  FileText,
  Download,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Info,
} from "lucide-react";
import { convertPdf } from "@/lib/actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { PricingModal } from "./PricingModal";
import { useAnonymousUsage } from "@/context/AnonymousUsageContext";
import { useRouter } from "next/navigation";

type Status = "idle" | "file-selected" | "processing" | "success" | "error";

interface StatementConverterProps {
    user: User | null;
}

export function StatementConverter({ user }: StatementConverterProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [convertedData, setConvertedData] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { anonymousCreations, decrementAnonymousCreations } = useAnonymousUsage();
  const router = useRouter();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
        });
        return;
      }
      setFile(selectedFile);
      setStatus("file-selected");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] ?? null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    handleFileChange(droppedFile);
  };

  const handleConvert = () => {
    if (!file) return;
    if (!user && anonymousCreations <= 0) {
      toast({
        variant: "destructive",
        title: "Free Limit Reached",
        description: "Please create an account to convert more documents.",
      });
      setIsPricingModalOpen(true);
      return;
    }

    startTransition(async () => {
      setStatus("processing");
      setErrorMessage("");

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const pdfDataUri = reader.result as string;
          try {
            const result = await convertPdf({ pdfDataUri, isAnonymous: !user });

            if (result.error) {
              setErrorMessage(result.error);
              setStatus("error");
              if (result.error.includes("limit")) {
                 toast({
                    variant: "destructive",
                    title: "Conversion Limit Reached",
                    description: result.error,
                });
                setIsPricingModalOpen(true);
              } else {
                 toast({
                    variant: "destructive",
                    title: "Conversion Failed",
                    description: result.error,
                });
              }
              return;
            }

            if (!result || !result.standardizedData) {
              throw new Error("Conversion returned no data.");
            }
            setConvertedData(result.standardizedData);
            setTotalTokens(result.totalTokens || 0);
            setStatus("success");
            
            if (!user) {
              decrementAnonymousCreations();
            } else {
              // For logged-in users, refresh server components to get new credit count
              router.refresh();
            }

            toast({
              variant: "default",
              className: "bg-accent text-accent-foreground",
              title: "Conversion Successful",
              description: "Your file is ready for download.",
            });
          } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "An unknown error occurred during conversion.";
            setErrorMessage(message);
            setStatus("error");
            toast({
              variant: "destructive",
              title: "Conversion Failed",
              description: message,
            });
          }
        };
        reader.onerror = () => {
          const message = "Failed to read the file. Please try again.";
          setErrorMessage(message);
          setStatus("error");
          toast({
            variant: "destructive",
            title: "File Read Error",
            description: message,
          });
        };
      } catch (error) {
        const message = "An unexpected error occurred. Please try again.";
        setErrorMessage(message);
        setStatus("error");
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      }
    });
  };

  const handleDownload = () => {
    const blob = new Blob([convertedData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = file?.name.replace(/\.pdf$/i, ".csv") || "converted_statement.csv";
    
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStatus("idle");
    setFile(null);
    setConvertedData("");
    setErrorMessage("");
    setTotalTokens(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderContent = () => {
    switch (status) {
      case "processing":
        return (
          <div className="flex flex-col items-center justify-center text-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 font-medium text-lg">Processing Statement...</p>
            <p className="text-muted-foreground">AI is extracting and formatting your data. Please wait.</p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="mt-4 font-medium text-lg">Conversion Successful!</p>
            <p className="text-muted-foreground mb-4">Preview your data below and download the CSV file.</p>
            <Textarea
              readOnly
              value={convertedData}
              className="my-4 h-48 w-full resize-none bg-muted font-mono text-xs"
              placeholder="Converted data preview..."
            />
            {totalTokens > 0 && (
              <TooltipProvider>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Cpu className="mr-2 h-4 w-4" />
                  <span>AI tokens used: {totalTokens.toLocaleString()}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-1 h-5 w-5 rounded-full">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>
                        Tokens are pieces of words the AI uses to process information. The total includes the document content and the generated CSV data. Costs are based on token usage.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
            <div className="flex gap-4">
              <Button onClick={handleReset} variant="outline">Convert Another File</Button>
              <Button onClick={handleDownload} className="bg-green-500 text-white hover:bg-green-600">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center text-center p-10">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="mt-4 font-medium text-lg">Conversion Failed</p>
            <p className="text-muted-foreground mb-4 max-w-sm">{errorMessage}</p>
            <Button onClick={handleReset} variant="destructive">
              Try Again
            </Button>
          </div>
        );
      case "file-selected":
        return (
          <div className="flex flex-col items-center justify-center text-center p-10">
            <FileText className="h-12 w-12 text-primary" />
            <p className="mt-4 font-medium">{file?.name}</p>
            {file && <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>}
            <div className="flex gap-4 mt-6">
              <Button onClick={handleReset} variant="outline">Change File</Button>
              <Button onClick={handleConvert} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert to CSV"
                )}
              </Button>
            </div>
          </div>
        );
      case "idle":
      default:
        return (
          <div
            className={`flex flex-col items-center justify-center p-10 transition-colors`}
          >
            <Button size="lg" className={cn("h-14 text-lg btn-gradient", 'text-white')} onClick={() => fileInputRef.current?.click()}>
              Click here to convert a PDF!
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="application/pdf"
            />
          </div>
        );
    }
  };

  return (
    <>
      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
      <Card className="w-full bg-white/90 backdrop-blur-sm shadow-sm">
        <CardContent className="p-2">
          {renderContent()}
        </CardContent>
      </Card>
    </>
  );
}

    