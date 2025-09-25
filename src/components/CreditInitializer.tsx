
'use client';

import { useCredit } from '@/context/CreditContext';
import { useEffect } from 'react';

interface CreditInitializerProps {
  initialInfo: string;
}

export function CreditInitializer({ initialInfo }: CreditInitializerProps) {
  const { setAnonymousCreations, setUserCreditInfo } = useCredit();

  useEffect(() => {
    // This component receives the initial credit info string from the server layout.
    // It could be for an anonymous or a logged-in user.
    // We set both context states. The CreditInfo component will then decide which one to use.
    
    // For anonymous users, we parse the count.
    const anonMatch = initialInfo.match(/^(\d+)/);
    if (anonMatch) {
      setAnonymousCreations(parseInt(anonMatch[1], 10));
    }

    // For all users, we set the full string.
    setUserCreditInfo(initialInfo);

  }, [initialInfo, setAnonymousCreations, setUserCreditInfo]);

  return null; // This component doesn't render anything
}
