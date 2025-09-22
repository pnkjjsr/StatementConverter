
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
import { Check } from 'lucide-react';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tiers = {
  monthly: [
    {
      name: 'Starter',
      price: '$15',
      priceSuffix: '/ month',
      features: ['400 pages / month'],
      cta: 'Buy',
    },
    {
      name: 'Professional',
      price: '$30',
      priceSuffix: '/ month',
      features: ['1000 pages / month'],
      cta: 'Buy',
    },
    {
      name: 'Business',
      price: '$50',
      priceSuffix: '/ month',
      features: ['4000 pages / month'],
      cta: 'Buy',
    },
    {
      name: 'Enterprise',
      price: 'Need More?',
      priceSuffix: '',
      features: [],
      cta: 'Contact',
    },
  ],
  annual: [
    {
      name: 'Starter',
      price: '$12',
      priceSuffix: '/ month',
      features: ['400 pages / month'],
      cta: 'Buy',
    },
    {
      name: 'Professional',
      price: '$24',
      priceSuffix: '/ month',
      features: ['1000 pages / month'],
      cta: 'Buy',
    },
    {
      name: 'Business',
      price: '$40',
      priceSuffix: '/ month',
      features: ['4000 pages / month'],
      cta: 'Buy',
    },
    {
      name: 'Enterprise',
      price: 'Need More?',
      priceSuffix: '',
      features: [],
      cta: 'Contact',
    },
  ],
};

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold">Pricing Plans</DialogTitle>
          <DialogDescription>
            Choose the plan that's right for you. Save more with an annual subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center my-4 space-x-4">
          <Tabs defaultValue="monthly" onValueChange={(value) => setPlan(value as 'monthly' | 'annual')} className="w-auto">
            <TabsList>
              <TabsTrigger value="monthly">Monthly Plan</TabsTrigger>
              <TabsTrigger value="annual">Annual Plan</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-sm font-semibold text-primary">Save more yearly!</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(tiers[plan] || tiers.monthly).map((tier) => (
            <Card key={tier.name} className="flex flex-col">
              <CardHeader className="items-center text-center">
                <CardTitle className="text-xl font-semibold">{tier.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.priceSuffix}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-between items-center text-center p-6 pt-0">
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={tier.name === 'Enterprise' ? 'outline' : 'default'}>
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
