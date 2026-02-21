import { Heart, MessageCircle, Shield, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Heart, title: t.features.smartMatches, description: t.features.smartMatchesDesc },
    { icon: MessageCircle, title: t.features.secureChat, description: t.features.secureChatDesc },
    { icon: Shield, title: t.features.verifiedProfiles, description: t.features.verifiedProfilesDesc },
    { icon: Sparkles, title: t.features.superLikes, description: t.features.superLikesDesc },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 font-display">
            {t.features.title} <span className="text-gradient">{t.features.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
            {t.features.description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-5 md:p-7 rounded-2xl md:rounded-3xl hover:shadow-glow transition-all duration-500 hover:-translate-y-2 animate-slide-up group"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl gradient-primary flex items-center justify-center mb-4 md:mb-5 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
              </div>
              <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-1.5 md:mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-xs md:text-sm lg:text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
