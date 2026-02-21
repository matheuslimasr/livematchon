import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useAppVersion } from "@/contexts/AppVersionContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { downloadApp, currentVersion, loading } = useAppVersion();
  const { trackDownloadClick } = useAnalytics();
  const { t } = useLanguage();

  const handleDownload = async () => {
    await trackDownloadClick();
    downloadApp();
  };

  return (
    <section id="download" className="relative py-20 md:py-28 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/50" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 md:px-5 md:py-2.5 rounded-full mb-5 md:mb-7">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground fill-primary-foreground" />
            <span className="text-xs md:text-sm font-medium text-primary-foreground">
              {t.cta.badge}
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 md:mb-6 font-display">
            {t.cta.title}
          </h2>
          
          <p className="text-sm md:text-lg lg:text-xl text-primary-foreground/80 mb-8 md:mb-10 max-w-xl mx-auto px-2">
            {t.cta.description}
          </p>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleDownload}
            disabled={loading}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-none font-bold group text-sm md:text-base shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-bounce" />
            {currentVersion ? `${t.cta.downloadButton} v${currentVersion.version}` : t.cta.downloadButton}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
