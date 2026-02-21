import { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  MousePointerClick, 
  Clock, 
  TrendingUp, 
  Monitor, 
  Smartphone, 
  Tablet,
  Trash2,
  RefreshCw,
  Eye,
  Download,
  Calendar,
  Globe,
  Share2,
  Chrome
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  downloadClicks: number;
  downloadRate: number;
  avgDuration: number;
  todayVisits: number;
  deviceStats: Record<string, number>;
  browserStats: Record<string, number>;
  sourceStats: Record<string, number>;
  recentVisits: Array<{
    id: string;
    visitor_id: string;
    clicked_download: boolean;
    duration_seconds: number;
    device_type: string;
    browser: string;
    traffic_source: string;
    created_at: string;
  }>;
}

const AnalyticsSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [data, setData] = useState<AnalyticsData>({
    totalVisits: 0,
    uniqueVisitors: 0,
    downloadClicks: 0,
    downloadRate: 0,
    avgDuration: 0,
    todayVisits: 0,
    deviceStats: {},
    browserStats: {},
    sourceStats: {},
    recentVisits: [],
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const { data: visits, error } = await supabase
        .from("analytics_visits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (visits) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalVisits = visits.length;
        const uniqueVisitors = new Set(visits.map(v => v.visitor_id)).size;
        const downloadClicks = visits.filter(v => v.clicked_download).length;
        const downloadRate = totalVisits > 0 ? (downloadClicks / totalVisits) * 100 : 0;
        
        const totalDuration = visits.reduce((acc, v) => acc + (v.duration_seconds || 0), 0);
        const avgDuration = totalVisits > 0 ? totalDuration / totalVisits : 0;

        const todayVisits = visits.filter(v => {
          const visitDate = new Date(v.created_at);
          return visitDate >= today;
        }).length;

        // Device stats
        const deviceStats: Record<string, number> = {};
        visits.forEach(v => {
          const device = v.device_type || "desktop";
          deviceStats[device] = (deviceStats[device] || 0) + 1;
        });

        // Browser stats
        const browserStats: Record<string, number> = {};
        visits.forEach(v => {
          const browser = v.browser || "Desconhecido";
          browserStats[browser] = (browserStats[browser] || 0) + 1;
        });

        // Traffic source stats
        const sourceStats: Record<string, number> = {};
        visits.forEach(v => {
          const source = v.traffic_source || "Direto";
          sourceStats[source] = (sourceStats[source] || 0) + 1;
        });

        setData({
          totalVisits,
          uniqueVisitors,
          downloadClicks,
          downloadRate,
          avgDuration,
          todayVisits,
          deviceStats,
          browserStats,
          sourceStats,
          recentVisits: visits.slice(0, 15),
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    const channel = supabase
      .channel("analytics-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "analytics_visits",
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAnalytics]);

  const handleClearAnalytics = async () => {
    if (!confirm("Tem certeza que deseja limpar TODOS os dados de analytics? Esta ação não pode ser desfeita.")) {
      return;
    }

    setClearing(true);
    try {
      const { error } = await supabase
        .from("analytics_visits")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast({
        title: "Analytics limpo!",
        description: "Todos os dados foram removidos com sucesso.",
      });

      fetchAnalytics();
    } catch (error) {
      console.error("Error clearing analytics:", error);
      toast({
        title: "Erro",
        description: "Não foi possível limpar os dados.",
        variant: "destructive",
      });
    } finally {
      setClearing(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile": return <Smartphone className="w-4 h-4" />;
      case "tablet": return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string): string => {
    const colors: Record<string, string> = {
      "TikTok": "bg-pink-500",
      "Instagram": "bg-purple-500",
      "Facebook": "bg-blue-600",
      "Google": "bg-red-500",
      "Twitter/X": "bg-sky-500",
      "YouTube": "bg-red-600",
      "WhatsApp": "bg-green-500",
      "Telegram": "bg-blue-400",
      "LinkedIn": "bg-blue-700",
      "Discord": "bg-indigo-500",
      "Direto": "bg-gray-500",
    };
    return colors[source] || "bg-primary";
  };

  const sortedStats = (stats: Record<string, number>) => {
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  return (
    <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Analytics em Tempo Real
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={loading}
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAnalytics}
            disabled={clearing}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Limpar Tudo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-primary-foreground/60">Carregando...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
                <Eye className="w-4 h-4" />
                Total Visitas
              </div>
              <p className="text-2xl font-bold">{data.totalVisits}</p>
            </div>

            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
                <Users className="w-4 h-4" />
                Visitantes Únicos
              </div>
              <p className="text-2xl font-bold">{data.uniqueVisitors}</p>
            </div>

            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                Visitas Hoje
              </div>
              <p className="text-2xl font-bold">{data.todayVisits}</p>
            </div>

            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
                <MousePointerClick className="w-4 h-4" />
                Cliques Download
              </div>
              <p className="text-2xl font-bold text-primary">{data.downloadClicks}</p>
            </div>

            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
                <Download className="w-4 h-4" />
                Taxa de Conversão
              </div>
              <p className="text-2xl font-bold text-primary">{data.downloadRate.toFixed(1)}%</p>
            </div>

            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
                <Clock className="w-4 h-4" />
                Tempo Médio
              </div>
              <p className="text-2xl font-bold">{formatDuration(data.avgDuration)}</p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Device Stats */}
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" />
                Dispositivos
              </h3>
              <div className="space-y-3">
                {sortedStats(data.deviceStats).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device)}
                      <span className="capitalize">{device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-primary rounded-full"
                          style={{ 
                            width: `${data.totalVisits > 0 ? (count / data.totalVisits) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
                {Object.keys(data.deviceStats).length === 0 && (
                  <p className="text-primary-foreground/40 text-sm">Sem dados</p>
                )}
              </div>
            </div>

            {/* Browser Stats */}
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Chrome className="w-4 h-4 text-primary" />
                Navegadores
              </h3>
              <div className="space-y-3">
                {sortedStats(data.browserStats).slice(0, 5).map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary-foreground/60" />
                      <span className="text-sm truncate max-w-24">{browser}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-primary rounded-full"
                          style={{ 
                            width: `${data.totalVisits > 0 ? (count / data.totalVisits) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
                {Object.keys(data.browserStats).length === 0 && (
                  <p className="text-primary-foreground/40 text-sm">Sem dados</p>
                )}
              </div>
            </div>

            {/* Traffic Source Stats */}
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                Origem do Tráfego
              </h3>
              <div className="space-y-3">
                {sortedStats(data.sourceStats).slice(0, 5).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSourceColor(source)}`} />
                      <span className="text-sm truncate max-w-24">{source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${getSourceColor(source)}`}
                          style={{ 
                            width: `${data.totalVisits > 0 ? (count / data.totalVisits) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
                {Object.keys(data.sourceStats).length === 0 && (
                  <p className="text-primary-foreground/40 text-sm">Sem dados</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Visits Table */}
          <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-primary-foreground/10">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Visitas Recentes
              </h3>
            </div>
            {data.recentVisits.length === 0 ? (
              <div className="p-8 text-center text-primary-foreground/60">
                Nenhuma visita registrada ainda
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-foreground/5">
                    <tr className="text-left text-sm text-primary-foreground/60">
                      <th className="p-3">Visitante</th>
                      <th className="p-3">Dispositivo</th>
                      <th className="p-3">Navegador</th>
                      <th className="p-3">Origem</th>
                      <th className="p-3">Download</th>
                      <th className="p-3">Tempo</th>
                      <th className="p-3">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentVisits.map((visit) => (
                      <tr key={visit.id} className="border-t border-primary-foreground/5 hover:bg-primary-foreground/5">
                        <td className="p-3">
                          <span className="text-xs font-mono bg-primary-foreground/10 px-2 py-1 rounded">
                            {visit.visitor_id.slice(0, 10)}...
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(visit.device_type || "desktop")}
                            <span className="capitalize text-sm">{visit.device_type || "desktop"}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">{visit.browser || "Desconhecido"}</span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${getSourceColor(visit.traffic_source || "Direto")}`}>
                            {visit.traffic_source || "Direto"}
                          </span>
                        </td>
                        <td className="p-3">
                          {visit.clicked_download ? (
                            <span className="inline-flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">
                              <MousePointerClick className="w-3 h-3" />
                              Sim
                            </span>
                          ) : (
                            <span className="text-primary-foreground/40 text-xs">Não</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {formatDuration(visit.duration_seconds || 0)}
                        </td>
                        <td className="p-3 text-sm text-primary-foreground/60">
                          {formatDate(visit.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsSection;
