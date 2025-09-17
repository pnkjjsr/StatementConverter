
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./AnimatedSection";

export function Pricing() {
  const tiers = [
    {
      name: "Anonymous",
      description: "Anonymous conversions with no need to sign up",
      price: "Free",
      features: ["1 page every 24 hours"],
      cta: null,
    },
    {
      name: "Registered",
      description: "Registration is free",
      price: "Free",
      features: ["5 pages every 24 hours"],
      cta: "Register",
    },
    {
      name: "Subscribe",
      description: "Subscribe to convert more documents",
      price: null,
      features: [],
      cta: "Register",
    },
  ];

  return (
    <AnimatedSection className="max-w-6xl mx-auto py-16 px-4 relative z-10">
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-end justify-between">
                {tier.price !== null ? (
                    <p className="text-4xl font-bold">{tier.price}</p>
                ) : <div />}
                {tier.cta && (
                  <a href="#" className="text-primary hover:underline">{tier.cta}</a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
