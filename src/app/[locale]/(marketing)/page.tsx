import HeroSection from "./components/section/HeroSection";
import HowItWorkSection from "./components/section/HowItWorkSection";
import FeaturedSection from "./components/section/FeaturedSection";
import TestimonialSection from "./components/section/TestimonialSection";
import NewsLatter from "./components/section/NewsLatter";
import PricingSection from "./components/section/PricingSection";
import { ContactSection } from "./components/section/ContactSection";
import ServicesSection from "./components/section/ServicesSection";

const HomePage = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
      <HeroSection />

      <HowItWorkSection />

      <ServicesSection />

      <FeaturedSection />

      <PricingSection />

      <TestimonialSection />

      <NewsLatter />

      <ContactSection />
    </section>
  );
};

export default HomePage;
