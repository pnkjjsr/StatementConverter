
import { EyeOff, UserCheck, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "./AnimatedSection";

export function Pricing() {
  const tiers = [
    {
      name: "Anonymous",
      description: "Anonymous conversions with no need to sign up. 1 page every 24 hours.",
      icon: <EyeOff className="h-8 w-8 text-primary" />,
      cta: null,
    },
    {
      name: "Registered",
      description: "Registration is free. Get 5 pages every 24 hours.",
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      cta: "Register",
    },
    {
      name: "Subscribe",
      description: "Subscribe to convert more documents and unlock premium features.",
      icon: <Crown className="h-8 w-8 text-primary" />,
      cta: "Subscribe",
    },
  ];

  return (
    <AnimatedSection className="max-w-6xl mx-auto py-16 px-4 relative z-10" delay={0.4}>
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col bg-white/50 backdrop-blur-sm shadow-lg border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="flex-1 flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-6">{tier.description}</p>
              </div>
              {tier.cta && (
                  <a href="#" className="font-semibold text-primary hover:underline flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right ml-1"><path d="m9 18 6-6-6-6"></path></svg>
                  </a>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
