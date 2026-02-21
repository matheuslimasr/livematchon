import { Radio, Eye, Heart, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import liveGif1 from "@/assets/gif1.gif";
import liveGif2 from "@/assets/gif2.gif";
import liveGif3 from "@/assets/gif3.gif";
import liveGif4 from "@/assets/gif4.gif";

const lives = [
  { id: 1, name: "Marina", age: 24, image: liveGif1, viewers: 1243, isLive: true, isVip: true },
  { id: 2, name: "Maria", age: 27, image: liveGif2, viewers: 856, isLive: true, isVip: false },
  { id: 3, name: "Beatriz", age: 23, image: liveGif3, viewers: 2104, isLive: true, isVip: true },
  { id: 4, name: "Gaby", age: 26, image: liveGif4, viewers: 678, isLive: true, isVip: false },
];

const LivesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-1.5 md:gap-2 glass px-4 py-2 md:px-5 md:py-2.5 rounded-full mb-4 md:mb-5">
            <Radio className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" />
            <span className="text-xs md:text-sm font-semibold text-primary tracking-wider uppercase">{t.lives.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 font-display">
            {t.lives.title} <span className="text-gradient">{t.lives.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
            {t.lives.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {lives.map((live, index) => (
            <div
              key={live.id}
              className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={live.image}
                  alt={live.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* VIP badge */}
                {live.isVip && (
                  <div className="absolute top-2 left-2 md:top-3 md:left-12 flex items-center gap-1 glass px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                    <Crown className="w-2.5 h-2.5 md:w-3 md:h-3 text-accent" />
                    <span className="text-[9px] md:text-[10px] font-bold text-accent tracking-wider">VIP</span>
                  </div>
                )}

                {/* Live badge */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1 md:gap-1.5 bg-primary px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-glow">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-foreground rounded-full animate-pulse" />
                  <span className="text-[10px] md:text-xs font-bold text-primary-foreground tracking-wider">LIVE</span>
                </div>
                
                {/* Viewers count */}
                <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-0.5 md:gap-1 glass px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                  <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary-foreground/80" />
                  <span className="text-[10px] md:text-xs font-medium text-primary-foreground/80">
                    {live.viewers.toLocaleString()}
                  </span>
                </div>
                
                {/* User info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-sm md:text-lg font-bold text-primary-foreground drop-shadow-lg">
                        {live.name}, {live.age}
                      </h3>
                    </div>
                    <button className="w-8 h-8 md:w-10 md:h-10 rounded-full gradient-primary flex items-center justify-center hover:scale-110 transition-transform shadow-glow">
                      <Heart className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary-foreground" />
                    </button>
                  </div>
                </div>

                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-transparent group-hover:border-primary/40 transition-colors duration-500" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 md:mt-12">
          <p className="text-muted-foreground text-sm md:text-base">
            <span className="font-bold text-primary text-lg md:text-xl">+500</span>{" "}
            <span className="text-foreground/60">{t.lives.livesCount.replace("+500 ", "")}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LivesSection;
