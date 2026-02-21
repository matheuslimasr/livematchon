import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border/30 py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-5 md:gap-7">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-bold text-foreground">LoveMatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
