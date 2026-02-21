import { BarChart3 } from "lucide-react";
import AnalyticsSection from "@/components/AnalyticsSection";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Visualize as métricas e estatísticas do site</p>
      </div>

      <AnalyticsSection />
    </div>
  );
}
