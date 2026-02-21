import { UserPlus, Heart, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: UserPlus, step: "01", title: t.howItWorks.step1Title, description: t.howItWorks.step1Desc },
    { icon: Heart, step: "02", title: t.howItWorks.step2Title, description: t.howItWorks.step2Desc },
    { icon: MessageCircle, step: "03", title: t.howItWorks.step3Title, description: t.howItWorks.step3Desc },
    { icon: Sparkles, step: "04", title: t.howItWorks.step4Title, description: t.howItWorks.step4Desc },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 font-display">
            {t.howItWorks.title} <span className="text-gradient">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
            {t.howItWorks.description}
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-y-1/2" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {steps.map((step) => (
              <div key={step.step} className="relative text-center group">
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-500 shadow-glow">
                    <step.icon className="w-7 h-7 md:w-9 md:h-9 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-foreground text-background text-xs md:text-sm font-bold flex items-center justify-center border-2 border-primary/50">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-1 md:mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm lg:text-base">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
