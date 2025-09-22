
// src/app/earn-credits/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthModal } from '@/components/AuthModal';

export default function EarnCreditsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setOrigin(window.location.origin);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        // Since we can't directly query auth.users from the client,
        // we'll need a way to get the referral code.
        // For now, we'll assume it's in user_metadata.
        // A better approach would be an RPC function in Supabase.
        const code = session.user.user_metadata?.referral_code;
        if(code) {
            setReferralCode(code);
        } else {
            // A placeholder until the server can provide one
            // In a real app, you'd fetch this securely.
            const pseudoCode = session.user.id.substring(0, 8);
            setReferralCode(pseudoCode);
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
       if (session?.user) {
        const code = session.user.user_metadata?.referral_code;
         if(code) {
            setReferralCode(code);
        } else {
            const pseudoCode = session.user.id.substring(0, 8);
            setReferralCode(pseudoCode);
        }
      } else {
        setReferralCode(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const referralLink = referralCode ? `${origin}/?ref=${referralCode}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Copied to Clipboard!',
      description: 'Your referral link has been copied.',
    });
  };

  return (
    <>
     <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} initialView="signup" />
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Earn Free Credits
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Love our service? Share it with your friends and earn credits for every successful referral!
        </p>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loading ? (
            <p>Loading your referral link...</p>
          ) : user && referralLink ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">Share this link. When someone signs up, you get 10 extra page credits.</p>
              <div className="flex w-full max-w-md items-center space-x-2">
                <Input type="text" value={referralLink} readOnly className="text-center"/>
                <Button type="button" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">Sign up or log in to get your unique referral link.</p>
              <Button onClick={() => setIsAuthModalOpen(true)}>Get Your Link</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="prose prose-lg mx-auto mt-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          How It Works
        </h2>
        <ol className="list-decimal list-inside space-y-4">
          <li><strong>Share Your Link:</strong> Copy your unique referral link above and share it with friends, colleagues, or on social media.</li>
          <li><strong>Friend Signs Up:</strong> When someone clicks your link and signs up for a free account, they become your referral.</li>
          <li><strong>You Earn Credits:</strong> For every successful sign-up, we'll automatically add 10 page credits to your account balance. It's that simple!</li>
        </ol>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          Frequently Asked Questions
        </h2>
        <p><strong>Is there a limit to how many credits I can earn?</strong><br/>Nope! The more friends you refer, the more credits you can earn. There is no limit.</p>
        <p><strong>When do I receive my credits?</strong><br/>Credits are added to your account instantly as soon as your referred friend successfully creates and verifies their account.</p>
        <p><strong>Can I track my referrals?</strong><br/>Currently, we don't have a dashboard to track individual referrals, but you will see your credit balance increase in your account section (coming soon!).</p>
      </div>
    </div>
    </>
  );
}
