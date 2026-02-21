import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppVersion } from "@/contexts/AppVersionContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { downloadApp, loading } = useAppVersion();
  const { trackDownloadClick } = useAnalytics();
  const { t } = useLanguage();

  const handleDownload = async () => {
    await trackDownloadClick();
    downloadApp();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-base md:text-xl font-bold text-foreground">LiveMatch</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
