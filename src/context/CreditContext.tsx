
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { getUserCreditInfo } from '@/lib/actions';

interface CreditContextType {
  anonymousCreations: number;
  setAnonymousCreations: (count: number) => void;
  decrementAnonymousCreations: () => void;
  userCreditInfo: string | null;
  setUserCreditInfo: (info: string | null) => void;
  refreshUserCreditInfo: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: ReactNode }) => {
  const [anonymousCreations, setAnonymousCreations] = useState(1);
  const [userCreditInfo, setUserCreditInfo] = useState<string | null>(null);

  const decrementAnonymousCreations = () => {
    setAnonymousCreations((prev) => Math.max(0, prev - 1));
  };

  const refreshUserCreditInfo = useCallback(async () => {
      const info = await getUserCreditInfo();
      setUserCreditInfo(info);
  }, []);

  return (
    <CreditContext.Provider value={{ anonymousCreations, setAnonymousCreations, decrementAnonymousCreations, userCreditInfo, setUserCreditInfo, refreshUserCreditInfo }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredit = () => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredit must be used within a CreditProvider');
  }
  return context;
};
