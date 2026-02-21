import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AppVersion {
  id: string;
  version: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  is_active: boolean;
  created_at: string;
}

interface AppVersionContextType {
  currentVersion: AppVersion | null;
  loading: boolean;
  downloadApp: () => void;
  refetch: () => Promise<void>;
}

const AppVersionContext = createContext<AppVersionContextType | undefined>(undefined);

export const AppVersionProvider = ({ children }: { children: ReactNode }) => {
  const [currentVersion, setCurrentVersion] = useState<AppVersion | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentVersion = async () => {
    try {
      const { data, error } = await supabase
        .from("app_versions")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching app version:", error);
      }
      
      setCurrentVersion(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentVersion();
  }, []);

  const downloadApp = () => {
    if (currentVersion?.file_url) {
      const link = document.createElement("a");
      link.href = currentVersion.file_url;
      link.download = currentVersion.file_name || "lovematch.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Nenhuma versão do app disponível para download. Em breve!");
    }
  };

  const refetch = async () => {
    setLoading(true);
    await fetchCurrentVersion();
  };

  return (
    <AppVersionContext.Provider value={{ currentVersion, loading, downloadApp, refetch }}>
      {children}
    </AppVersionContext.Provider>
  );
};

export const useAppVersion = () => {
  const context = useContext(AppVersionContext);
  if (!context) {
    throw new Error("useAppVersion must be used within an AppVersionProvider");
  }
  return context;
};
