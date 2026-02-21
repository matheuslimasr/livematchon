import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LivesSection from "@/components/LivesSection";
import InstallationTutorial from "@/components/InstallationTutorial";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingHearts from "@/components/FloatingHearts";
import DownloadBar from "@/components/DownloadBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingHearts />
      <Header />
      <main className="pt-16">
        <HeroSection />
        <section id="lives">
          <LivesSection />
        </section>
        {/* <InstallationTutorial /> */}
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <section id="download">
          <CTASection />
        </section>
      </main>
      <DownloadBar />
    </div>
  );
};

export default Index;
