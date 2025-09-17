import { ShieldCheck, Landmark, Target } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <ShieldCheck className="h-12 w-12 text-green-500" />,
      title: "Secure",
      description: "With years of experience in banking we comply with strict standards when handling your files.",
    },
    {
      icon: <Landmark className="h-12 w-12 text-yellow-500" />,
      title: "Institutional",
      description: "We've provided our services to thousands of reputable financial, accounting and legal firms.",
    },
    {
      icon: <Target className="h-12 w-12 text-red-500" />,
      title: "Accurate",
      description: "We're continually improving our algorithms. If a file doesn't convert to your expectations, email us and we'll fix it.",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-4 relative z-10">
      <div className="grid md:grid-cols-3 gap-12 text-center">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
