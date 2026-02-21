import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAdmin } from "@/contexts/AdminContext";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 shrink-0">
            <SidebarTrigger className="text-foreground hover:bg-muted">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
