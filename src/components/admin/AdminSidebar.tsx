import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Heart,
  Globe,
  Video,
  Upload,
  FileArchive,
  Image,
  BarChart3,
  LogOut,
  Home,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Idioma", url: "/admin/dashboard", icon: Globe },
  { title: "Vídeo Tutorial", url: "/admin/dashboard/video", icon: Video },
  { title: "Upload App", url: "/admin/dashboard/upload", icon: Upload },
  { title: "Versões", url: "/admin/dashboard/versions", icon: FileArchive },
  { title: "Tutorial", url: "/admin/dashboard/tutorial", icon: Image },
  { title: "Analytics", url: "/admin/dashboard/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} bg-background border-r border-border`} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4 bg-background">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white truncate">LoveMatch</h1>
              <p className="text-xs text-white/60 truncate">Painel Admin</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50 text-xs uppercase tracking-wider px-2 mb-2">
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                      activeClassName="bg-primary/30 text-primary"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 space-y-2 bg-background">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
        >
          <Home className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="ml-2">Ver Site</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-coral hover:text-coral hover:bg-coral/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
