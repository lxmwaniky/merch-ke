import { Truck, Shield, Zap, Gift } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick delivery across Kenya. Get your swag in no time.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and secure payment options including M-Pesa.",
  },
  {
    icon: Zap,
    title: "Quality Products",
    description: "Premium quality tech merchandise you can trust.",
  },
  {
    icon: Gift,
    title: "Loyalty Rewards",
    description: "Earn points with every purchase and get exclusive deals.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
