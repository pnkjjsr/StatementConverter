
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getUserCreditInfo } from '@/lib/actions';
import { useAnonymousUsage } from '@/context/AnonymousUsageContext';

export default function CreditInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [creditInfo, setCreditInfo] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const { anonymousCreations } = useAnonymousUsage();
  const supabase = createSupabaseBrowserClient();

  const updateCreditInfo = useCallback(async (currentUser: User | null) => {
    setCreditInfo('Loading...');
    const info = await getUserCreditInfo(currentUser);
    setCreditInfo(info);
  }, []);

  useEffect(() => {
    if (!supabase) return;

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
      updateCreditInfo(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);


  useEffect(() => {
    // This effect specifically handles live updates for anonymous users based on client-side context.
    if (!user && !loading) {
      // The back-end check is what produces the countdown string like "0 pages remaining (23h 59m left)"
      // So we must re-fetch from the server whenever the client-side anonymous count changes.
      getUserCreditInfo(null).then(setCreditInfo);
    }
  }, [anonymousCreations, user, loading]);


  return <span>{creditInfo}</span>;
}
