import BusinessesSection from "./_components/BusinessesSection/BusinessesSection";
import CTASection from "./_components/CTASection/CTASection";
import FeaturesSection from "./_components/FeaturesSection/FeaturesSection";
import HeroSection from "./_components/HeroSection/HeroSection";
import HowItWorkSection from "./_components/HowItWorkSection/HowItWorkSection";
import PricingSection from "./_components/PricingSection/PricingSection";
import Testimonials from "./_components/Testimonials/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorkSection />
      <BusinessesSection />
      <PricingSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
