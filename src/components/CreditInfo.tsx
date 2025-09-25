
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useCredit } from '@/context/CreditContext';

export default function CreditInfo() {
  const [user, setUser] = useState<User | null>(null);
  const { anonymousCreations, userCreditInfo, refreshUserCreditInfo } = useCredit();
  const supabase = createSupabaseBrowserClient();

  const updateCreditInfo = useCallback(() => {
    refreshUserCreditInfo();
  }, [refreshUserCreditInfo]);


  useEffect(() => {
    if (!supabase) return;

    const fetchInitialUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      updateCreditInfo();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, updateCreditInfo]);

  useEffect(() => {
    if (!user) {
        updateCreditInfo();
    }
  }, [anonymousCreations, user, updateCreditInfo]);

  // For anonymous users, the context provides the most up-to-date info, including countdowns
  if (!user) {
    return <span>{userCreditInfo || 'Loading...'}</span>
  }

  // For logged-in users, the context's userCreditInfo is the source of truth.
  return <span>{userCreditInfo || 'Loading...'}</span>;
}
