import Hero from "@/components/home/hero";
import FeaturedProducts from "@/components/home/featured-products";
import CategoriesSection from "@/components/home/categories-section";
import Features from "@/components/home/features";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoriesSection />
      <Features />
    </>
  );
}
