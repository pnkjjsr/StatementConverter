
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useAnonymousUsage } from '@/context/AnonymousUsageContext';
import { getUserCreditInfo } from '@/lib/actions';

export default function CreditInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [creditInfo, setCreditInfo] = useState('Loading...');
  const { anonymousCreations } = useAnonymousUsage();

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

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user) {
        updateCreditInfo(null);
    }
  }, [anonymousCreations, user]);

  const updateCreditInfo = async (currentUser: User | null) => {
    setCreditInfo('Loading...');
    if (currentUser) {
      const info = await getUserCreditInfo(currentUser);
      setCreditInfo(info);
    } else {
      setCreditInfo(`${anonymousCreations} page${anonymousCreations === 1 ? '' : 's'} remaining`);
    }
  };

  return <span>{creditInfo}</span>;
}
