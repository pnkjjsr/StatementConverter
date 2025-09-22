
import { Check, User, UserPlus, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AnimatedSection } from './AnimatedSection';

const tiers = [
  {
    name: 'Anonymous',
    price: 'Free',
    features: ['Anonymous conversions with no need to sign up', '1 page every 24 hours'],
    buttonText: null,
    buttonVariant: 'outline',
  },
  {
    name: 'Registered',
    price: 'Free',
    features: ['Registration is free', '5 pages every 24 hours'],
    buttonText: 'Register',
    buttonVariant: 'link',
  },
  {
    name: 'Subscribe',
    price: null,
    features: ['Subscribe to convert more documents'],
    buttonText: 'Register',
    buttonVariant: 'default',
    highlighted: true,
  },
];

export function Tiers() {
  return (
    <AnimatedSection className="max-w-6xl mx-auto py-16 px-4 relative z-10" delay={0.4}>
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.highlighted ? 'border-primary ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.includes('page') ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    ) : (
                      <span className="w-5 mr-2 flex-shrink-0" />
                    )}
                    <p className="text-muted-foreground">{feature}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-4">
              {tier.price && <span className="text-2xl font-bold">{tier.price}</span>}
              {tier.buttonText && (
                <Button variant={tier.buttonVariant} className={tier.buttonVariant === 'link' ? 'p-0 h-auto' : ''}>
                  {tier.buttonText}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
