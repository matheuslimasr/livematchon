import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";
import phoneMockup from "@/assets/phone-mockup.png";
import heroMainBg from "@/assets/hero-main-bg.jpg";
import { useAppVersion } from "@/contexts/AppVersionContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { downloadApp, currentVersion, loading } = useAppVersion();
  const { trackDownloadClick } = useAnalytics();
  const { t } = useLanguage();

  const handleDownload = () => {
    const tutorialSection = document.getElementById('tutorial');
    if (tutorialSection) {
      tutorialSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroMainBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      </div>

      {/* Ambient red glow */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left space-y-4 md:space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 md:px-5 md:py-2.5 rounded-full">
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-primary fill-primary" />
              <span className="text-xs md:text-sm font-medium text-foreground/80">
                {t.hero.badge}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight font-display">
              {t.hero.title}{" "}
              <span className="text-gradient">{t.hero.titleHighlight}</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              {t.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button 
                variant="download" 
                size="lg" 
                onClick={handleDownload}
                className="group text-sm md:text-base shadow-glow"
                disabled={loading}
              >
                <Download className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-bounce" />
                {currentVersion ? `${t.hero.downloadButton} v${currentVersion.version}` : t.header.downloadApp}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6 justify-center lg:justify-start pt-2 md:pt-4">
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-foreground">5M+</p>
                <p className="text-xs md:text-sm text-muted-foreground">{t.hero.users}</p>
              </div>
              <div className="w-px h-8 md:h-10 bg-border/50" />
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-foreground">4.8</p>
                <p className="text-xs md:text-sm text-muted-foreground">{t.hero.rating}</p>
              </div>
              <div className="w-px h-8 md:h-10 bg-border/50" />
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-foreground">100K+</p>
                <p className="text-xs md:text-sm text-muted-foreground">{t.hero.couples}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end animate-slide-up animation-delay-200">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-[3rem] blur-3xl opacity-20 scale-90" />
              <img
                src={phoneMockup}
                alt="App de relacionamentos"
                className="relative z-10 w-48 sm:w-56 md:w-72 lg:w-80 xl:w-96 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
