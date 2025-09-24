
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getUserCreditInfo } from '@/lib/actions';
import { useAnonymousUsage } from '@/context/AnonymousUsageContext';

export default function CreditInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [creditInfo, setCreditInfo] = useState('Loading...');
  const [loading, setLoading] = useState(true); // State to manage initial auth check
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
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await updateCreditInfo(currentUser);
        setLoading(false);
    };

    fetchInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!loading) { // Only update if initial load is complete
        updateCreditInfo(currentUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCreditInfo]);


  useEffect(() => {
    // This effect specifically handles updates for anonymous users
    // when their credit count changes in the context, but only after initial load.
    if (!user && !loading) {
        getUserCreditInfo(null).then(setCreditInfo);
    }
  }, [anonymousCreations, user, loading]);


  return <span>{creditInfo}</span>;
}
