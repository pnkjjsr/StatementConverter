
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { ContactModal } from './ContactModal';
import { tiers } from '@/lib/tiers';
import { useToast } from '@/hooks/use-toast';
import { createSubscription, verifyPaymentAndUpdateDB } from '@/lib/razorpay-actions';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  useEffect(() => {
    if (!supabase) return;

    const fetchInitialUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);


  const handleChoosePlan = async (tier: (typeof tiers.monthly)[0]) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in or sign up to choose a plan.',
      });
      return;
    }

    if (tier.cta === 'Contact Us') {
      onOpenChange(false);
      setIsContactModalOpen(true);
      return;
    }

    if (!tier.razorpay_plan_id) {
        toast({
            variant: 'destructive',
            title: 'Plan Not Available',
            description: 'This plan is not available for purchase at the moment.',
        });
        return;
    }

    setLoading(tier.name);

    try {
        const subResult = await createSubscription({ planId: tier.razorpay_plan_id });

        if (subResult.error || !subResult.subscriptionId || !subResult.keyId) {
            throw new Error(subResult.error || 'Failed to create subscription.');
        }

        const options = {
            key: subResult.keyId,
            subscription_id: subResult.subscriptionId,
            name: 'Bank Statement Converter',
            description: `Subscription for ${tier.name} Plan`,
            handler: async function (response: any) {
                try {
                    const verificationResult = await verifyPaymentAndUpdateDB({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_subscription_id: response.razorpay_subscription_id,
                        razorpay_signature: response.razorpay_signature,
                        userId: user.id,
                        planId: tier.razorpay_plan_id!,
                    });

                    if (verificationResult.error) {
                        throw new Error(verificationResult.error);
                    }

                    toast({
                        title: 'Payment Successful!',
                        description: `You are now subscribed to the ${tier.name} plan.`,
                        className: 'bg-green-500 text-white',
                    });
                    onOpenChange(false);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "An unknown error occurred during payment verification.";
                    toast({
                        variant: 'destructive',
                        title: 'Payment Verification Failed',
                        description: message,
                    });
                }
            },
            prefill: {
                name: user.user_metadata?.full_name || '',
                email: user.email,
            },
            theme: {
                color: '#0ea5e9', // primary color
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: 'destructive',
            title: 'Subscription Failed',
            description: message,
        });
    } finally {
        setLoading(null);
    }
  };


  return (
    <>
      <ContactModal open={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl p-0">
          <div className="p-8">
            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-4xl font-bold">Pricing Plans</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground">
                Choose the plan that's right for you. Get 2 months free with an annual subscription.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center my-6">
              <Tabs defaultValue="monthly" onValueChange={(value) => setPlan(value as 'monthly' | 'annual')} className="w-auto">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">Annual</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {(tiers[plan] || tiers.monthly).map((tier) => (
                <Card key={tier.name} className={cn(
                  "flex flex-col rounded-xl shadow-sm",
                  tier.popular ? "border-accent ring-2 ring-accent" : "border-border"
                )}>
                  <CardHeader className="relative p-6">
                    {tier.popular && <Badge variant="default" className="absolute top-0 -translate-y-1/2 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold">MOST POPULAR</Badge>}
                    <CardTitle className="text-2xl font-semibold mb-2">{tier.name}</CardTitle>
                    <CardDescription className="text-sm">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 p-6 pt-0">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                      {tier.priceSuffix && <span className="text-sm text-muted-foreground">{tier.priceSuffix}</span>}
                    </div>
                    <ul className="space-y-3 mb-8 text-sm flex-1">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={cn(
                        "w-full font-semibold",
                        tier.popular ? "bg-accent text-accent-foreground hover:bg-accent/90" : "bg-primary text-primary-foreground hover:bg-primary/90",
                        tier.cta === 'Contact Us' ? 'bg-transparent border border-primary text-primary hover:bg-primary/10' : ''
                      )}
                      variant={tier.popular ? 'default' : (tier.cta === 'Contact Us' ? 'outline' : 'default')}
                      onClick={() => handleChoosePlan(tier)}
                      disabled={loading === tier.name}
                    >
                      {loading === tier.name ? <Loader2 className="animate-spin" /> : tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8 text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Info className="w-4 h-4"/>
              <p>All prices are in USD. You can change or cancel your plan at any time.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
