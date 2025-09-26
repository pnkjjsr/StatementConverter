
'use client';

import { useState } from 'react';
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
import { Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { ContactModal } from './ContactModal';
import { tiers } from '@/lib/tiers';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleEnterpriseContact = () => {
    onOpenChange(false); // Close the pricing modal
    setIsContactModalOpen(true); // Open the contact modal
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
                      onClick={tier.cta === 'Contact Us' ? handleEnterpriseContact : undefined}
                    >
                      {tier.cta}
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
