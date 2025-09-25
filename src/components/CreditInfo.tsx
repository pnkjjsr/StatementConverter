
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getUserCreditInfo } from '@/lib/actions';
import { useAnonymousUsage } from '@/context/AnonymousUsageContext';

export default function CreditInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [creditInfo, setCreditInfo] = useState('Loading...');
  const [loading, setLoading] = useState(true); // State to manage initial auth check
  const { anonymousCreations } = useAnonymousUsage();
  const supabase = createSupabaseBrowserClient();

  const updateCreditInfo = useCallback(async (currentUser: User | null) => {
    // If the user is anonymous, we'll let the other useEffect handle it based on context changes
    if (!currentUser) {
        // Let the other effect handle it based on client-side context
        return;
    }
    setCreditInfo('Loading...'); // Show loading state while fetching
    const info = await getUserCreditInfo(currentUser);
    setCreditInfo(info);
  }, []);

  useEffect(() => {
    if (!supabase) return;
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
      // When auth state changes (login/logout), we should re-fetch.
      updateCreditInfo(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  // We only want this to run once on mount and when auth state changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);


  useEffect(() => {
    // This effect specifically handles updates for anonymous users
    // when their credit count changes in the context, but only after initial load.
    if (!user && !loading) {
        getUserCreditInfo(null).then(setCreditInfo);
    }
  }, [anonymousCreations, user, loading]);


  return <span>{creditInfo}</span>;
}
