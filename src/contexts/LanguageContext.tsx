import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "pt" | "pt-pt" | "en" | "es";

interface Translations {
  // Header
  header: {
    features: string;
    howItWorks: string;
    download: string;
    downloadApp: string;
  };
  // Hero
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    downloadButton: string;
    learnMore: string;
    users: string;
    rating: string;
    couples: string;
  };
  // Features
  features: {
    title: string;
    titleHighlight: string;
    description: string;
    smartMatches: string;
    smartMatchesDesc: string;
    secureChat: string;
    secureChatDesc: string;
    verifiedProfiles: string;
    verifiedProfilesDesc: string;
    superLikes: string;
    superLikesDesc: string;
  };
  // How it works
  howItWorks: {
    title: string;
    titleHighlight: string;
    description: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  // CTA
  cta: {
    badge: string;
    title: string;
    description: string;
    downloadButton: string;
  };
  // Footer
  footer: {
    about: string;
    privacy: string;
    terms: string;
    contact: string;
    copyright: string;
  };
  // Lives
  lives: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    livesCount: string;
  };
}

const translations: Record<Language, Translations> = {
  pt: {
    header: {
      features: "Recursos",
      howItWorks: "Como Funciona",
      download: "Entrar",
      downloadApp: "Acessar Agora",
    },
    hero: {
      badge: "🔞 +18 | Ao Vivo Agora",
      title: "Descubra o",
      titleHighlight: "prazer ao vivo",
      description: "Entre em lives exclusivas com modelos adultos. Converse no chat privado, envie presentes virtuais e viva experiências intensas em tempo real.",
      downloadButton: "Entrar Agora",
      learnMore: "Explorar",
      users: "Usuários Online",
      rating: "Avaliação",
      couples: "Shows Ao Vivo",
    },
    features: {
      title: "Por que escolher",
      titleHighlight: "nossa plataforma?",
      description: "Uma experiência adulta provocante, segura e totalmente interativa",
      smartMatches: "Conexões Privadas",
      smartMatchesDesc: "Encontre modelos que combinam com seus desejos e preferências.",
      secureChat: "Chat 100% Privado",
      secureChatDesc: "Converse com total discrição em salas privadas e seguras.",
      verifiedProfiles: "Perfis Verificados",
      verifiedProfilesDesc: "Modelos reais e verificados para sua segurança.",
      superLikes: "Pedidos Exclusivos",
      superLikesDesc: "Envie presentes e faça pedidos especiais durante as lives.",
    },
    howItWorks: {
      title: "Como",
      titleHighlight: "funciona?",
      description: "Entre, escolha e aproveite a experiência",
      step1Title: "Crie sua conta +18",
      step1Desc: "Cadastro rápido e acesso imediato às salas ao vivo.",
      step2Title: "Escolha uma live",
      step2Desc: "Explore centenas de modelos transmitindo agora.",
      step3Title: "Entre no chat privado",
      step3Desc: "Interaja ao vivo e torne o momento ainda mais intenso.",
      step4Title: "Aproveite sem limites",
      step4Desc: "Viva experiências exclusivas feitas para você.",
    },
    cta: {
      badge: "Acesso imediato",
      title: "Pronto para entrar ao vivo?",
      description: "Cadastre-se agora e descubra um mundo adulto cheio de prazer, interação e exclusividade.",
      downloadButton: "Entrar e Assistir",
    },
    footer: {
      about: "Sobre",
      privacy: "Privacidade",
      terms: "Termos +18",
      contact: "Contato",
      copyright: "© 2026 LiveDesire. Plataforma exclusiva para maiores de 18 anos.",
    },
    lives: {
      badge: "🔥 AO VIVO AGORA",
      title: "Shows",
      titleHighlight: "em tempo real",
      description: "Modelos adultos transmitindo ao vivo neste momento. Interaja, envie presentes e entre no privado.",
      livesCount: "+1000 transmissões acontecendo agora",
    },
  },

  en: {
    header: {
      features: "Features",
      howItWorks: "How It Works",
      download: "Enter",
      downloadApp: "Access Now",
    },
    hero: {
      badge: "🔞 18+ | Live Now",
      title: "Discover",
      titleHighlight: "live pleasure",
      description: "Join exclusive adult live streams. Chat privately, send virtual gifts and enjoy intense real-time experiences.",
      downloadButton: "Enter Now",
      learnMore: "Explore",
      users: "Users Online",
      rating: "Rating",
      couples: "Live Shows",
    },
    features: {
      title: "Why choose",
      titleHighlight: "our platform?",
      description: "A provocative adult experience, secure and fully interactive",
      smartMatches: "Private Connections",
      smartMatchesDesc: "Find performers that match your desires and preferences.",
      secureChat: "100% Private Chat",
      secureChatDesc: "Talk discreetly in secure private rooms.",
      verifiedProfiles: "Verified Performers",
      verifiedProfilesDesc: "Real and verified models for your safety.",
      superLikes: "Exclusive Requests",
      superLikesDesc: "Send gifts and make special requests during live shows.",
    },
    howItWorks: {
      title: "How does it",
      titleHighlight: "work?",
      description: "Join, choose and enjoy the experience",
      step1Title: "Create your 18+ account",
      step1Desc: "Quick sign-up and instant access to live rooms.",
      step2Title: "Choose a live show",
      step2Desc: "Browse hundreds of models streaming now.",
      step3Title: "Enter private chat",
      step3Desc: "Interact live and make the moment even more exciting.",
      step4Title: "Enjoy without limits",
      step4Desc: "Experience exclusive adult entertainment.",
    },
    cta: {
      badge: "Instant Access",
      title: "Ready to go live?",
      description: "Sign up now and explore a world of adult entertainment, interaction and exclusivity.",
      downloadButton: "Enter & Watch",
    },
    footer: {
      about: "About",
      privacy: "Privacy",
      terms: "18+ Terms",
      contact: "Contact",
      copyright: "© 2026 LiveDesire. Adults only platform.",
    },
    lives: {
      badge: "🔥 LIVE NOW",
      title: "Live",
      titleHighlight: "shows",
      description: "Adult performers streaming right now. Interact, send gifts and go private.",
      livesCount: "+1000 streams happening now",
    },
  },

  es: {
    header: {
      features: "Funciones",
      howItWorks: "Cómo Funciona",
      download: "Entrar",
      downloadApp: "Acceder Ahora",
    },
    hero: {
      badge: "🔞 +18 | En Vivo",
      title: "Descubre el",
      titleHighlight: "placer en vivo",
      description: "Únete a transmisiones exclusivas para adultos. Chatea en privado y disfruta experiencias intensas en tiempo real.",
      downloadButton: "Entrar Ahora",
      learnMore: "Explorar",
      users: "Usuarios Online",
      rating: "Calificación",
      couples: "Shows en Vivo",
    },
    features: {
      title: "¿Por qué elegir",
      titleHighlight: "nuestra plataforma?",
      description: "Una experiencia adulta provocativa, segura e interactiva",
      smartMatches: "Conexiones Privadas",
      smartMatchesDesc: "Encuentra modelos según tus preferencias.",
      secureChat: "Chat 100% Privado",
      secureChatDesc: "Habla con total discreción en salas privadas.",
      verifiedProfiles: "Perfiles Verificados",
      verifiedProfilesDesc: "Modelos reales y verificados.",
      superLikes: "Pedidos Exclusivos",
      superLikesDesc: "Envía regalos y haz solicitudes especiales.",
    },
    howItWorks: {
      title: "¿Cómo",
      titleHighlight: "funciona?",
      description: "Regístrate, elige y disfruta",
      step1Title: "Crea tu cuenta +18",
      step1Desc: "Registro rápido y acceso inmediato.",
      step2Title: "Elige una transmisión",
      step2Desc: "Explora cientos de modelos en vivo.",
      step3Title: "Entra al chat privado",
      step3Desc: "Interactúa en tiempo real.",
      step4Title: "Disfruta sin límites",
      step4Desc: "Vive experiencias exclusivas para adultos.",
    },
    cta: {
      badge: "Acceso inmediato",
      title: "¿Listo para entrar en vivo?",
      description: "Regístrate ahora y descubre entretenimiento adulto exclusivo.",
      downloadButton: "Entrar y Ver",
    },
    footer: {
      about: "Acerca de",
      privacy: "Privacidad",
      terms: "Términos +18",
      contact: "Contacto",
      copyright: "© 2026 LiveDesire. Plataforma exclusiva para adultos.",
    },
    lives: {
      badge: "🔥 EN VIVO AHORA",
      title: "Shows",
      titleHighlight: "en tiempo real",
      description: "Modelos transmitiendo ahora mismo. Interactúa y entra en privado.",
      livesCount: "+1000 transmisiones ahora",
    },
  },

  "pt-br": {
    header: {
      features: "Recursos",
      howItWorks: "Como Funciona",
      download: "Entrar",
      downloadApp: "Acessar Agora",
    },
    hero: {
      badge: "🔞 +18 | Ao Vivo Agora",
      title: "Descubra o",
      titleHighlight: "prazer sem limites",
      description: "Entre em lives adultas exclusivas. Converse no chat privado, envie presentes e viva experiências intensas em tempo real.",
      downloadButton: "Entrar Agora",
      learnMore: "Explorar",
      users: "Usuários Online",
      rating: "Avaliação",
      couples: "Shows Ao Vivo",
    },
    features: {
      title: "Por que escolher",
      titleHighlight: "nossa plataforma?",
      description: "Uma experiência adulta provocante, segura e totalmente interativa",
      smartMatches: "Conexões Privadas",
      smartMatchesDesc: "Descubra modelos que combinam com seus desejos e preferências.",
      secureChat: "Chat 100% Privado",
      secureChatDesc: "Discrição total em salas privadas seguras.",
      verifiedProfiles: "Perfis Verificados",
      verifiedProfilesDesc: "Modelos reais e verificados para sua segurança.",
      superLikes: "Pedidos Exclusivos",
      superLikesDesc: "Envie presentes virtuais e faça solicitações especiais durante as lives.",
    },
    howItWorks: {
      title: "Como",
      titleHighlight: "funciona?",
      description: "Entre, escolha e aproveite cada momento",
      step1Title: "Crie sua conta +18",
      step1Desc: "Cadastro rápido e acesso imediato às transmissões.",
      step2Title: "Escolha uma live",
      step2Desc: "Explore centenas de modelos transmitindo agora.",
      step3Title: "Entre no privado",
      step3Desc: "Interaja ao vivo e torne a experiência ainda mais envolvente.",
      step4Title: "Aproveite ao máximo",
      step4Desc: "Experiências exclusivas feitas para você.",
    },
    cta: {
      badge: "Acesso imediato",
      title: "Pronto para entrar ao vivo?",
      description: "Cadastre-se agora e descubra um universo adulto cheio de interação e exclusividade.",
      downloadButton: "Entrar e Assistir",
    },
    footer: {
      about: "Sobre",
      privacy: "Privacidade",
      terms: "Termos +18",
      contact: "Contato",
      copyright: "© 2026 LiveDesire. Plataforma exclusiva para maiores de 18 anos.",
    },
    lives: {
      badge: "🔥 AO VIVO AGORA",
      title: "Shows",
      titleHighlight: "em tempo real",
      description: "Modelos adultos transmitindo neste momento. Interaja, envie presentes e entre no privado.",
      livesCount: "+1000 transmissões acontecendo agora",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("lovematch-language");
    return (saved as Language) || "pt";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lovematch-language", lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("lovematch-language");
    if (saved && ["pt", "pt-pt", "en", "es"].includes(saved)) {
      setLanguageState(saved as Language);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const languageNames: Record<Language, string> = {
  pt: "Português (BR)",
  "pt-pt": "Português (PT)",
  en: "English",
  es: "Español",
};
