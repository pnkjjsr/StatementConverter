
import { Check, User, UserPlus, Gem, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AnimatedSection } from './AnimatedSection';

const tiers = [
  {
    icon: <User className="h-8 w-8 text-primary" />,
    name: 'Anonymous',
    description: 'Anonymous conversions with no need to sign up. Limited to 1 page every 24 hours.',
    buttonText: null,
  },
  {
    icon: <UserPlus className="h-8 w-8 text-primary" />,
    name: 'Registered',
    description: 'Registration is free. Convert up to 5 pages every 24 hours and keep track of your history.',
    buttonText: 'Register for free',
    buttonVariant: 'link',
  },
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    name: 'Subscriber',
    description: 'Subscribe to a plan to convert more documents and unlock advanced features.',
    buttonText: 'View plans',
    buttonVariant: 'default',
    highlighted: true,
  },
];

export function Tiers() {
  return (
    <AnimatedSection className="max-w-6xl mx-auto py-16 px-4 relative z-10" delay={0.4}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Flexible Options for Everyone</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Start for free and scale up as your needs grow. No credit card required to get started.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col text-left p-6 bg-white/50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${tier.highlighted ? 'border-primary ring-2 ring-primary/50' : 'border-slate-200'}`}>
            <div className="mb-4 bg-primary/10 rounded-lg w-14 h-14 flex items-center justify-center">
              {tier.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{tier.name}</h3>
            <p className="text-muted-foreground flex-1 mb-6">{tier.description}</p>
            {tier.buttonText && (
              <Button variant={tier.buttonVariant} className={tier.buttonVariant === 'link' ? 'p-0 h-auto text-primary font-semibold' : 'w-full'}>
                {tier.buttonText}
                {tier.buttonVariant === 'link' && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
