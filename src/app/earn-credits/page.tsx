
// src/app/earn-credits/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthModal } from '@/components/AuthModal';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  XIcon,
  WhatsappIcon,
} from 'react-share';
import { InviteFriendForm } from '@/components/InviteFriendForm';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
    {
      question: 'Is there a limit to how many credits I can earn?',
      answer:
        'Nope! The more friends you refer, the more credits you can earn. There is no limit.',
    },
    {
      question: 'When do I receive my credits?',
      answer:
        'Credits are added to your account instantly as soon as your referred friend successfully creates and verifies their account.',
    },
    {
      question: 'Can I track my referrals?',
      answer:
        "Currently, we don't have a dashboard to track individual referrals, but you will see your credit balance increase in your account section (coming soon!).",
    },
  ];

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
        const code = session.user.user_metadata?.referral_code;
        if (code) {
          setReferralCode(code);
        } else {
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
        if (code) {
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
  const shareTitle = "Check out this awesome PDF to Excel converter!";
  const shareBody = "I've been using this tool to convert my bank statements to Excel and it's a huge time saver. You should try it out!";

  const copyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Copied to Clipboard!',
      description: 'Your referral link has been copied.',
    });
  };

  const socialShareButtons = [
    { Button: LinkedinShareButton, Icon: LinkedinIcon, props: { url: referralLink, title: shareTitle } },
    { Button: FacebookShareButton, Icon: FacebookIcon, props: { url: referralLink, quote: shareBody } },
    { Button: TwitterShareButton, Icon: XIcon, props: { url: referralLink, title: shareBody } },
    { Button: WhatsappShareButton, Icon: WhatsappIcon, props: { url: referralLink, title: shareBody, separator: " " } },
    { Button: RedditShareButton, Icon: RedditIcon, props: { url: referralLink, title: shareTitle } },
    { Button: TelegramShareButton, Icon: TelegramIcon, props: { url: referralLink, title: shareBody } },
    { Button: EmailShareButton, Icon: EmailIcon, props: { url: referralLink, subject: shareTitle, body: shareBody } },
  ] as const;

  const ReferralCardSkeleton = () => (
    <div className="flex flex-col items-center gap-6">
       <Skeleton className="h-5 w-3/4" />
      <div className="flex w-full max-w-md items-center space-x-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="w-full max-w-md">
        <Skeleton className="h-5 w-1/3 mx-auto mb-4" />
        <div className="flex justify-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="w-full max-w-2xl">
         <div className="mt-8 pt-8 border-t">
            <Skeleton className="h-5 w-1/3 mx-auto mb-4" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} initialView="signup" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col">
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
                <ReferralCardSkeleton />
            ) : user && referralLink ? (
              <div className="flex flex-col items-center gap-6">
                <p className="text-muted-foreground">Share this link. When someone signs up, you get 10 extra page credits.</p>
                <div className="flex w-full max-w-md items-center space-x-2">
                  <Input type="text" value={referralLink} readOnly className="text-center" />
                  <Button type="button" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-full max-w-md">
                  <CardDescription className="text-center mb-4 font-semibold">Or share directly</CardDescription>
                  <div className="flex justify-center gap-3">
                    {socialShareButtons.map(({ Button: ShareButton, Icon, props }, index) => (
                      <ShareButton key={index} {...props}>
                        <Icon size={40} round />
                      </ShareButton>
                    ))}
                  </div>
                </div>

                <div className="w-full max-w-2xl">
                  <InviteFriendForm referralLink={referralLink} />
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

        <div className="mx-auto mt-12 w-full">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-8">
                How It Works
            </h2>
            <div className="prose prose-lg mx-auto">
                <ol className="list-decimal list-inside space-y-4">
                    <li><strong>Share Your Link:</strong> Copy your unique referral link above and share it with friends, colleagues, or on social media.</li>
                    <li><strong>Friend Signs Up:</strong> When someone clicks your link and signs up for a free account, they become your referral.</li>
                    <li><strong>You Earn Credits:</strong> For every successful sign-up, we'll automatically add 10 page credits to your account balance. It's that simple!</li>
                </ol>
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-8">
                    Frequently Asked Questions
                </h2>
                 <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqItems.map((item, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="bg-gray-900/5 backdrop-blur-sm border border-black/10 rounded-xl faq-accordion-item"
                    >
                        <AccordionTrigger className="text-left font-semibold p-6 text-gray-800 hover:no-underline">
                        {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-0 text-gray-600">
                        {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
      </div>
    </>
  );
}
