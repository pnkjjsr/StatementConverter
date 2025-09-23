
'use client';

import { useAnonymousUsage } from '@/context/AnonymousUsageContext';
import { useEffect } from 'react';

interface AnonymousUsageInitializerProps {
  initialCount: number;
}

export function AnonymousUsageInitializer({ initialCount }: AnonymousUsageInitializerProps) {
  const { setAnonymousCreations } = useAnonymousUsage();

  useEffect(() => {
    setAnonymousCreations(initialCount);
  }, [initialCount, setAnonymousCreations]);

  return null; // This component doesn't render anything
}
