
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getUserCreditInfo } from '@/lib/actions';
import { useAnonymousUsage } from '@/context/AnonymousUsageContext';

export default function CreditInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [creditInfo, setCreditInfo] = useState('Loading...');
  const { anonymousCreations } = useAnonymousUsage();

  const updateCreditInfo = useCallback(async (currentUser: User | null) => {
    setCreditInfo('Loading...'); // Show loading state while fetching
    const info = await getUserCreditInfo(currentUser);
    setCreditInfo(info);
  }, []);

  useEffect(() => {
    // This effect runs once on mount to get the initial user session
    // and set up the auth state change listener.
    const fetchInitialUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        updateCreditInfo(currentUser);
    };

    fetchInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      updateCreditInfo(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateCreditInfo]);


  useEffect(() => {
    // This effect specifically handles updates for anonymous users
    // when their credit count changes in the context.
    if (!user) {
      if (anonymousCreations > 0) {
        setCreditInfo(`${anonymousCreations} page remaining`);
      } else {
        // This part needs to be smarter to show the timer if applicable
        // For now, let's keep it simple. We can enhance this if getUserCreditInfo is updated.
        getUserCreditInfo(null).then(setCreditInfo);
      }
    }
  }, [anonymousCreations, user]);


  return <span>{creditInfo}</span>;
}
