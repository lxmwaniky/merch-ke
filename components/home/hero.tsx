import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://files.cdn.printful.com/o/upload/bfl-image/c1/w258/11516_l_V10__600.jpg"
          alt="Tech merchandise background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background/50 backdrop-blur-sm">
            🇰🇪 Made for Kenya
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Tech Swag That
            <span className="block text-primary">Speaks Your Language</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From hoodies to mugs, get your favorite tech merchandise delivered right to your doorstep in Kenya.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Browse Categories
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">Fast</div>
              <div className="text-sm text-muted-foreground">Delivery</div>
            </div>
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
