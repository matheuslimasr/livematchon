import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import { AppVersionProvider } from "@/contexts/AppVersionContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TutorialVideoProvider } from "@/contexts/TutorialVideoContext";
import { TutorialStepsProvider } from "@/contexts/TutorialStepsContext";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "@/components/admin/AdminLayout";
import LanguagePage from "@/pages/admin/LanguagePage";
import VideoPage from "@/pages/admin/VideoPage";
import UploadPage from "@/pages/admin/UploadPage";
import VersionsPage from "@/pages/admin/VersionsPage";
import TutorialPage from "@/pages/admin/TutorialPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AdminProvider>
          <AppVersionProvider>
            <TutorialVideoProvider>
              <TutorialStepsProvider>
                <AnalyticsProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/admin" element={<AdminLogin />} />
                      
                      {/* Admin Dashboard with sidebar layout */}
                      <Route path="/admin/dashboard" element={<AdminLayout />}>
                        <Route index element={<LanguagePage />} />
                        <Route path="video" element={<VideoPage />} />
                        <Route path="upload" element={<UploadPage />} />
                        <Route path="versions" element={<VersionsPage />} />
                        <Route path="tutorial" element={<TutorialPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                      </Route>
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </AnalyticsProvider>
              </TutorialStepsProvider>
            </TutorialVideoProvider>
          </AppVersionProvider>
        </AdminProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
