import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTutorialSteps } from "@/contexts/TutorialStepsContext";
import { motion, AnimatePresence } from "framer-motion";

// Fallback images for when no steps are in database
import step1 from "@/assets/tutorial/step-1.png";
import step2 from "@/assets/tutorial/step-2.png";
import step3 from "@/assets/tutorial/step-3.png";
import step4 from "@/assets/tutorial/step-4.png";
import step5 from "@/assets/tutorial/step-5.png";
import step6 from "@/assets/tutorial/step-6.png";
import step7 from "@/assets/tutorial/step-7.png";
import step8 from "@/assets/tutorial/step-8.png";
import step9 from "@/assets/tutorial/step-9.png";
import step10 from "@/assets/tutorial/step-10.png";
import step11 from "@/assets/tutorial/step-11.png";
import step12 from "@/assets/tutorial/step-12.png";
import step13 from "@/assets/tutorial/step-13.png";
import step14 from "@/assets/tutorial/step-14.png";

interface LocalTutorialStep {
  image: string;
  title: Record<string, string>;
  description: Record<string, string>;
}

const fallbackSteps: LocalTutorialStep[] = [
  {
    image: step1,
    title: { pt: "1. Clique em Baixar", "pt-pt": "1. Clica em Transferir", en: "1. Click Download", es: "1. Haz clic en Descargar" },
    description: { pt: "Acesse o site e clique no botão vermelho \"Baixar\" para iniciar o download do aplicativo.", "pt-pt": "Acede ao site e clica no botão vermelho \"Transferir\" para iniciar a transferência da aplicação.", en: "Access the website and click the red \"Download\" button to start downloading the app.", es: "Accede al sitio web y haz clic en el botón rojo \"Descargar\" para iniciar la descarga de la aplicación." },
  },
  {
    image: step2,
    title: { pt: "2. Arquivo Baixado", "pt-pt": "2. Ficheiro Transferido", en: "2. File Downloaded", es: "2. Archivo Descargado" },
    description: { pt: "Após o download, você verá uma notificação no topo da tela. Clique em \"Abrir\" para continuar.", "pt-pt": "Após a transferência, verás uma notificação no topo do ecrã. Clica em \"Abrir\" para continuar.", en: "After downloading, you'll see a notification at the top of the screen. Click \"Open\" to continue.", es: "Después de la descarga, verás una notificación en la parte superior de la pantalla. Haz clic en \"Abrir\" para continuar." },
  },
  {
    image: step3,
    title: { pt: "3. Acesse Downloads", "pt-pt": "3. Acede a Transferências", en: "3. Access Downloads", es: "3. Accede a Descargas" },
    description: { pt: "Caso a notificação desapareça, clique nos 3 pontos do navegador e vá em \"Descargas\" para encontrar o arquivo.", "pt-pt": "Caso a notificação desapareça, clica nos 3 pontos do navegador e vai a \"Transferências\" para encontrar o ficheiro.", en: "If the notification disappears, click the 3 dots in the browser and go to \"Downloads\" to find the file.", es: "Si la notificación desaparece, haz clic en los 3 puntos del navegador y ve a \"Descargas\" para encontrar el archivo." },
  },
  {
    image: step4,
    title: { pt: "4. Clique em Instalar", "pt-pt": "4. Clica em Instalar", en: "4. Click Install", es: "4. Haz clic en Instalar" },
    description: { pt: "Ao abrir o arquivo, aparecerá uma janela perguntando se deseja instalar. Clique em \"Instalar\".", "pt-pt": "Ao abrir o ficheiro, aparecerá uma janela a perguntar se desejas instalar. Clica em \"Instalar\".", en: "When you open the file, a window will appear asking if you want to install. Click \"Install\".", es: "Al abrir el archivo, aparecerá una ventana preguntando si deseas instalar. Haz clic en \"Instalar\"." },
  },
  {
    image: step5,
    title: { pt: "5. Instalação Concluída", "pt-pt": "5. Instalação Concluída", en: "5. Installation Complete", es: "5. Instalación Completada" },
    description: { pt: "A aplicação foi instalada. Agora abra o app para continuar a configuração.", "pt-pt": "A aplicação foi instalada. Agora abre a app para continuar a configuração.", en: "The app has been installed. Now open the app to continue setup.", es: "La aplicación se instaló. Ahora abre la app para continuar la configuración." },
  },
  {
    image: step6,
    title: { pt: "6. Atualização Disponível", "pt-pt": "6. Atualização Disponível", en: "6. Update Available", es: "6. Actualización Disponible" },
    description: { pt: "Ao abrir o app, será exibida uma tela de atualização. Clique em \"UPDATE\" para continuar.", "pt-pt": "Ao abrir a app, será exibido um ecrã de atualização. Clica em \"UPDATE\" para continuar.", en: "When opening the app, an update screen will appear. Click \"UPDATE\" to continue.", es: "Al abrir la app, se mostrará una pantalla de actualización. Haz clic en \"UPDATE\" para continuar." },
  },
  {
    image: step7,
    title: { pt: "7. Atualizar pela Play Store", "pt-pt": "7. Atualizar pela Play Store", en: "7. Update from Play Store", es: "7. Actualizar desde Play Store" },
    description: { pt: "Uma janela do Google Play aparecerá. Clique em \"Update now\" para baixar a atualização.", "pt-pt": "Uma janela do Google Play aparecerá. Clica em \"Update now\" para transferir a atualização.", en: "A Google Play window will appear. Click \"Update now\" to download the update.", es: "Aparecerá una ventana de Google Play. Haz clic en \"Update now\" para descargar la actualización." },
  },
  {
    image: step8,
    title: { pt: "8. Permitir Instalação", "pt-pt": "8. Permitir Instalação", en: "8. Allow Installation", es: "8. Permitir Instalación" },
    description: { pt: "O sistema pedirá permissão para instalar de fontes desconhecidas. Clique em \"Ajustes\" para configurar.", "pt-pt": "O sistema pedirá permissão para instalar de fontes desconhecidas. Clica em \"Ajustes\" para configurar.", en: "The system will ask permission to install from unknown sources. Click \"Settings\" to configure.", es: "El sistema pedirá permiso para instalar de fuentes desconocidas. Haz clic en \"Ajustes\" para configurar." },
  },
  {
    image: step9,
    title: { pt: "9. Conceder Permissão", "pt-pt": "9. Conceder Permissão", en: "9. Grant Permission", es: "9. Conceder Permiso" },
    description: { pt: "Ative a opção \"Conceder permiso\" e depois clique em \"Instalar\" na janela que aparecer.", "pt-pt": "Ativa a opção \"Conceder permissão\" e depois clica em \"Instalar\" na janela que aparecer.", en: "Enable \"Grant permission\" option and then click \"Install\" in the window that appears.", es: "Activa la opción \"Conceder permiso\" y luego haz clic en \"Instalar\" en la ventana que aparece." },
  },
  {
    image: step10,
    title: { pt: "10. Acessar Acessibilidade", "pt-pt": "10. Aceder a Acessibilidade", en: "10. Access Accessibility", es: "10. Acceder a Accesibilidad" },
    description: { pt: "Vá em Configurações > Acessibilidade e clique em \"Aplicaciones instaladas\".", "pt-pt": "Vai a Definições > Acessibilidade e clica em \"Aplicações instaladas\".", en: "Go to Settings > Accessibility and click on \"Installed apps\".", es: "Ve a Configuración > Accesibilidad y haz clic en \"Aplicaciones instaladas\"." },
  },
  {
    image: step11,
    title: { pt: "11. Menu de Acessibilidade", "pt-pt": "11. Menu de Acessibilidade", en: "11. Accessibility Menu", es: "11. Menú de Accesibilidad" },
    description: { pt: "No menu de Acessibilidade, encontre e clique em \"Aplicaciones instaladas\" para continuar.", "pt-pt": "No menu de Acessibilidade, encontra e clica em \"Aplicações instaladas\" para continuar.", en: "In the Accessibility menu, find and click on \"Installed apps\" to continue.", es: "En el menú de Accesibilidad, encuentra y haz clic en \"Aplicaciones instaladas\" para continuar." },
  },
  {
    image: step12,
    title: { pt: "12. Selecionar Chrome", "pt-pt": "12. Selecionar Chrome", en: "12. Select Chrome", es: "12. Seleccionar Chrome" },
    description: { pt: "Na lista de aplicações instaladas, encontre e clique em \"Chrome\".", "pt-pt": "Na lista de aplicações instaladas, encontra e clica em \"Chrome\".", en: "In the list of installed apps, find and click on \"Chrome\".", es: "En la lista de aplicaciones instaladas, encuentra y haz clic en \"Chrome\"." },
  },
  {
    image: step13,
    title: { pt: "13. Configurar Chrome", "pt-pt": "13. Configurar Chrome", en: "13. Configure Chrome", es: "13. Configurar Chrome" },
    description: { pt: "Na tela do Chrome, você verá as opções de configuração de acessibilidade.", "pt-pt": "No ecrã do Chrome, verás as opções de configuração de acessibilidade.", en: "On the Chrome screen, you'll see the accessibility configuration options.", es: "En la pantalla de Chrome, verás las opciones de configuración de accesibilidad." },
  },
  {
    image: step14,
    title: { pt: "14. Concluído!", "pt-pt": "14. Concluído!", en: "14. Complete!", es: "14. ¡Completado!" },
    description: { pt: "Ative \"Conceder permiso\" para acesso aos arquivos. Pronto! Agora você pode usar o app normalmente.", "pt-pt": "Ativa \"Conceder permissão\" para acesso aos ficheiros. Pronto! Agora podes usar a app normalmente.", en: "Enable \"Grant permission\" for file access. Done! Now you can use the app normally.", es: "Activa \"Conceder permiso\" para acceso a archivos. ¡Listo! Ahora puedes usar la app normalmente." },
  },
];

const InstallationTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { language } = useLanguage();
  const { steps: dbSteps, loading } = useTutorialSteps();

  // Use database steps if available, otherwise use fallback
  const useDbSteps = dbSteps.length > 0;
  const totalSteps = useDbSteps ? dbSteps.length : fallbackSteps.length;

  const goToNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Reset current step when steps change
  useEffect(() => {
    if (currentStep >= totalSteps) {
      setCurrentStep(0);
    }
  }, [totalSteps, currentStep]);

  const getCurrentStepData = () => {
    if (useDbSteps) {
      const step = dbSteps[currentStep];
      return {
        image: step.image_url,
        title: step[`title_${language === "pt-pt" ? "pt" : language}` as keyof typeof step] as string || step.title_pt,
        description: step[`description_${language === "pt-pt" ? "pt" : language}` as keyof typeof step] as string || step.description_pt,
      };
    } else {
      const step = fallbackSteps[currentStep];
      return {
        image: step.image,
        title: step.title[language] || step.title.pt,
        description: step.description[language] || step.description.pt,
      };
    }
  };

  const currentStepData = getCurrentStepData();

  const sectionTitle = {
    pt: "Tutorial de Instalação",
    "pt-pt": "Tutorial de Instalação",
    en: "Installation Tutorial",
    es: "Tutorial de Instalación",
  };

  const sectionDescription = {
    pt: "Siga o passo a passo para instalar o aplicativo no seu Android",
    "pt-pt": "Segue o passo a passo para instalar a aplicação no teu Android",
    en: "Follow the step-by-step guide to install the app on your Android",
    es: "Sigue el paso a paso para instalar la aplicación en tu Android",
  };

  const buttonLabels = {
    previous: { pt: "Anterior", "pt-pt": "Anterior", en: "Previous", es: "Anterior" },
    next: { pt: "Próximo", "pt-pt": "Próximo", en: "Next", es: "Siguiente" },
    finish: { pt: "Concluído", "pt-pt": "Concluído", en: "Complete", es: "Completado" },
  };

  if (loading) {
    return (
      <section id="tutorial" className="py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin w-10 h-10 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm md:text-base">Carregando tutorial...</p>
        </div>
      </section>
    );
  }

  if (totalSteps === 0) {
    return (
      <section id="tutorial" className="py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm md:text-base">Tutorial em breve...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tutorial" className="py-12 md:py-20 bg-card relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center gap-1.5 md:gap-2 glass px-4 py-2 md:px-5 md:py-2.5 rounded-full mb-3 md:mb-4">
            <Download className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-semibold text-primary tracking-wider uppercase">PASSO A PASSO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 font-display text-foreground">
            {sectionTitle[language]}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
            {sectionDescription[language]}
          </p>
        </div>

        {/* Progress Bar - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-full font-bold text-xs lg:text-sm transition-all duration-300 border-2 ${
                  index === currentStep
                    ? "gradient-primary text-primary-foreground scale-125 shadow-glow border-transparent"
                    : index < currentStep
                    ? "bg-primary/80 text-primary-foreground border-primary/60 shadow-md"
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:border-primary/50"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5 lg:w-6 lg:h-6" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
          {/* Progress Line - Enhanced */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden border border-border">
            <motion.div
              className="absolute top-0 left-0 h-full gradient-primary rounded-full shadow-glow"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {/* Progress Text */}
          <div className="text-center mt-3">
            <span className="text-primary font-bold text-xl">{currentStep + 1}</span>
            <span className="text-muted-foreground"> de </span>
            <span className="text-foreground/70 font-medium">{totalSteps}</span>
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 items-center"
              >
                {/* Phone Mockup with Screenshot */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] mx-auto">
                    {/* Phone Frame */}
                    <div className="relative bg-gradient-to-b from-muted to-background rounded-[2rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl border border-border/50">
                      {/* Screen */}
                      <div className="relative rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden bg-background">
                        <img
                          src={currentStepData.image}
                          alt={currentStepData.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                    {/* Step Badge */}
                    <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-10 h-10 md:w-14 md:h-14 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                      <span className="text-primary-foreground font-bold text-sm md:text-lg">{currentStep + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Step Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 text-foreground font-display">
                    {currentStepData.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
                    {currentStepData.description}
                  </p>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={goToPrevious}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 border-2 border-primary/50 hover:border-primary hover:bg-primary/20 disabled:opacity-30 disabled:border-muted/30 text-sm md:text-base px-4 md:px-6 py-2 md:py-3 font-semibold transition-all duration-300"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="hidden sm:inline">{buttonLabels.previous[language]}</span>
                    </Button>

                    {currentStep < totalSteps - 1 ? (
                      <Button
                        size="lg"
                        onClick={goToNext}
                        className="flex items-center gap-2 gradient-primary shadow-glow hover:scale-105 active:scale-95 text-sm md:text-base px-6 md:px-8 py-2 md:py-3 font-bold transition-all duration-300 animate-pulse hover:animate-none"
                      >
                        <span>{buttonLabels.next[language]}</span>
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="flex items-center gap-2 gradient-primary shadow-glow hover:scale-105 active:scale-95 text-sm md:text-base px-6 md:px-8 py-2 md:py-3 font-bold transition-all duration-300"
                      >
                        <Check className="w-5 h-5 md:w-6 md:h-6" />
                        <span>{buttonLabels.finish[language]}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Step Indicators Mobile - Enhanced */}
        <div className="flex justify-center items-center gap-2 md:gap-3 mt-6 md:mt-8 lg:hidden">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "gradient-primary w-8 md:w-10 h-3 md:h-4 shadow-glow"
                  : index < currentStep
                  ? "bg-primary/80 w-3 h-3 md:w-4 md:h-4 shadow-md"
                  : "bg-muted w-2.5 h-2.5 md:w-3 md:h-3 hover:bg-muted/80"
              }`}
              aria-label={`Ir para passo ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Text */}
        <div className="text-center mt-4 lg:hidden">
          <span className="text-primary font-bold text-lg md:text-xl">{currentStep + 1}</span>
          <span className="text-muted-foreground text-sm md:text-base"> / {totalSteps}</span>
        </div>
      </div>
    </section>
  );
};

export default InstallationTutorial;
