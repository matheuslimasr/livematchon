import { useEffect, useRef, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsContextType {
  trackDownloadClick: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Generate unique visitor ID (persisted in localStorage)
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
};

// Generate session ID (new for each visit/tab)
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    if (/ipad|tablet/i.test(userAgent)) {
      return "tablet";
    }
    return "mobile";
  }
  return "desktop";
};

// Detect browser name
const getBrowser = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("SamsungBrowser")) {
    return "Samsung Internet";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "Opera";
  } else if (userAgent.includes("Trident")) {
    return "Internet Explorer";
  } else if (userAgent.includes("Edge")) {
    return "Edge Legacy";
  } else if (userAgent.includes("Edg")) {
    return "Microsoft Edge";
  } else if (userAgent.includes("Chrome")) {
    return "Google Chrome";
  } else if (userAgent.includes("Safari")) {
    return "Safari";
  } else {
    return "Outro";
  }
};

// Detect traffic source from referrer or URL params
const getTrafficSource = (): string => {
  const referrer = document.referrer.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source")?.toLowerCase();
  const utmMedium = urlParams.get("utm_medium")?.toLowerCase();
  
  // Check UTM parameters first
  if (utmSource) {
    if (utmSource.includes("tiktok")) return "TikTok";
    if (utmSource.includes("google")) return "Google";
    if (utmSource.includes("facebook") || utmSource.includes("fb")) return "Facebook";
    if (utmSource.includes("instagram") || utmSource.includes("ig")) return "Instagram";
    if (utmSource.includes("twitter") || utmSource.includes("x.com")) return "Twitter/X";
    if (utmSource.includes("youtube") || utmSource.includes("yt")) return "YouTube";
    if (utmSource.includes("whatsapp")) return "WhatsApp";
    if (utmSource.includes("telegram")) return "Telegram";
    if (utmSource.includes("linkedin")) return "LinkedIn";
    if (utmSource.includes("pinterest")) return "Pinterest";
    if (utmSource.includes("reddit")) return "Reddit";
    if (utmSource.includes("snapchat")) return "Snapchat";
    if (utmSource.includes("kwai")) return "Kwai";
    return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
  }
  
  // Check referrer
  if (!referrer || referrer === "") {
    return "Direto";
  }
  
  // Social Media
  if (referrer.includes("tiktok.com") || referrer.includes("tiktokcdn")) return "TikTok";
  if (referrer.includes("facebook.com") || referrer.includes("fb.com") || referrer.includes("fbcdn")) return "Facebook";
  if (referrer.includes("instagram.com")) return "Instagram";
  if (referrer.includes("twitter.com") || referrer.includes("t.co") || referrer.includes("x.com")) return "Twitter/X";
  if (referrer.includes("youtube.com") || referrer.includes("youtu.be")) return "YouTube";
  if (referrer.includes("whatsapp.com") || referrer.includes("wa.me")) return "WhatsApp";
  if (referrer.includes("telegram.org") || referrer.includes("t.me")) return "Telegram";
  if (referrer.includes("linkedin.com")) return "LinkedIn";
  if (referrer.includes("pinterest.com")) return "Pinterest";
  if (referrer.includes("reddit.com")) return "Reddit";
  if (referrer.includes("snapchat.com")) return "Snapchat";
  if (referrer.includes("kwai.com")) return "Kwai";
  if (referrer.includes("discord.com") || referrer.includes("discord.gg")) return "Discord";
  
  // Search Engines
  if (referrer.includes("google.com") || referrer.includes("google.com.br")) return "Google";
  if (referrer.includes("bing.com")) return "Bing";
  if (referrer.includes("yahoo.com")) return "Yahoo";
  if (referrer.includes("duckduckgo.com")) return "DuckDuckGo";
  if (referrer.includes("baidu.com")) return "Baidu";
  
  // App stores
  if (referrer.includes("play.google.com")) return "Google Play";
  if (referrer.includes("apps.apple.com")) return "App Store";
  
  // Try to extract domain name
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace("www.", "");
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch {
    return "Outro";
  }
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const visitIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Track visit on mount
  useEffect(() => {
    const trackVisit = async () => {
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      
      try {
        const { data, error } = await supabase
          .from("analytics_visits")
          .insert({
            visitor_id: visitorId,
            session_id: sessionId,
            page_url: window.location.href,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            device_type: getDeviceType(),
            browser: getBrowser(),
            traffic_source: getTrafficSource(),
            clicked_download: false,
            visit_start: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (error) {
          console.error("Error tracking visit:", error);
        } else if (data) {
          visitIdRef.current = data.id;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    trackVisit();
    startTimeRef.current = Date.now();

    // Update visit duration on page unload
    const updateDuration = async () => {
      if (visitIdRef.current) {
        const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        try {
          await supabase
            .from("analytics_visits")
            .update({
              visit_end: new Date().toISOString(),
              duration_seconds: durationSeconds,
            })
            .eq("id", visitIdRef.current);
        } catch (error) {
          console.error("Error updating duration:", error);
        }
      }
    };

    // Update duration periodically (every 30 seconds)
    const intervalId = setInterval(() => {
      if (visitIdRef.current) {
        const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        supabase
          .from("analytics_visits")
          .update({ duration_seconds: durationSeconds })
          .eq("id", visitIdRef.current)
          .then(() => {});
      }
    }, 30000);

    // Handle page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateDuration();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", updateDuration);

    return () => {
      updateDuration();
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", updateDuration);
    };
  }, []);

  const trackDownloadClick = useCallback(async () => {
    if (visitIdRef.current) {
      try {
        await supabase
          .from("analytics_visits")
          .update({ clicked_download: true })
          .eq("id", visitIdRef.current);
      } catch (error) {
        console.error("Error tracking download click:", error);
      }
    }
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackDownloadClick }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
