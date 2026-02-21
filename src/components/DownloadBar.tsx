import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppVersion } from "@/contexts/AppVersionContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const DownloadBar = () => {
  const [visible, setVisible] = useState(false);
  const { downloadApp, currentVersion, loading } = useAppVersion();
  const { trackDownloadClick } = useAnalytics();
  const { t } = useLanguage();

  useEffect(() => {
    const tutorialSection = document.getElementById("tutorial");
    if (!tutorialSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(tutorialSection);
    return () => observer.disconnect();
  }, []);

  const handleDownload = async () => {
    await trackDownloadClick();
    downloadApp();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-primary/20"
        >
          <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-semibold text-sm md:text-base truncate">
                {currentVersion ? `LoveMatch v${currentVersion.version}` : "LoveMatch"}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm truncate">
                {t.hero.badge}
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={handleDownload}
              disabled={loading}
              className="gradient-primary shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-sm md:text-base px-6 md:px-8 flex-shrink-0"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{t.cta.downloadButton}</span>
              <span className="sm:hidden">Baixar</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadBar;
