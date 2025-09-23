
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AnonymousUsageContextType {
  anonymousCreations: number;
  setAnonymousCreations: (count: number) => void;
  decrementAnonymousCreations: () => void;
}

const AnonymousUsageContext = createContext<AnonymousUsageContextType | undefined>(undefined);

export const AnonymousUsageProvider = ({ children }: { children: ReactNode }) => {
  const [anonymousCreations, setAnonymousCreations] = useState(0);

  const decrementAnonymousCreations = () => {
    setAnonymousCreations((prev) => Math.max(0, prev - 1));
  };

  return (
    <AnonymousUsageContext.Provider value={{ anonymousCreations, setAnonymousCreations, decrementAnonymousCreations }}>
      {children}
    </AnonymousUsageContext.Provider>
  );
};

export const useAnonymousUsage = () => {
  const context = useContext(AnonymousUsageContext);
  if (context === undefined) {
    throw new Error('useAnonymousUsage must be used within an AnonymousUsageProvider');
  }
  return context;
};
