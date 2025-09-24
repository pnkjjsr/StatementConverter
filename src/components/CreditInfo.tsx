
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getUserCreditInfo } from '@/lib/actions';

export default function CreditInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [creditInfo, setCreditInfo] = useState('Loading...');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      updateCreditInfo(currentUser);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      updateCreditInfo(currentUser);
    });

    // Initial load and every hour thereafter to keep the timer fresh
    const interval = setInterval(() => updateCreditInfo(user), 1000 * 60 * 60);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [user]);

  const updateCreditInfo = async (currentUser: User | null) => {
    setCreditInfo('Loading...');
    const info = await getUserCreditInfo(currentUser);
    setCreditInfo(info);
  };

  return <span>{creditInfo}</span>;
}
