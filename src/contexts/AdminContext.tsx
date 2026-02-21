import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    setIsAuthenticated(!!adminToken);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-login", {
        body: { email, password },
      });

      if (error || !data?.ok) return false;

      localStorage.setItem("admin_token", data.adminId || "authenticated");
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Admin login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
