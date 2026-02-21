import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, Language, languageNames } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function LanguagePage() {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          Idioma do Site
        </h1>
        <p className="text-muted-foreground mt-1">
          Selecione o idioma padrão do site
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-wrap gap-3">
          {(["pt", "pt-pt", "en", "es"] as Language[]).map((lang) => (
            <Button
              key={lang}
              variant={language === lang ? "hero" : "outline"}
              onClick={() => {
                setLanguage(lang);
                toast({
                  title: "Idioma alterado!",
                  description: `O site agora está em ${languageNames[lang]}.`,
                });
              }}
              className={language !== lang ? "border-border text-foreground hover:bg-muted" : ""}
            >
              {languageNames[lang]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
