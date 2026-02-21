import { useState, useEffect, useCallback } from "react";
import { FileArchive, Download, Trash2, CheckCircle, HardDrive, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAppVersion } from "@/contexts/AppVersionContext";
import { useToast } from "@/hooks/use-toast";

interface AppVersion {
  id: string; version: string; file_url: string; file_name: string; file_size: number | null; is_active: boolean; created_at: string;
}

export default function VersionsPage() {
  const { refetch } = useAppVersion();
  const { toast } = useToast();
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVersions = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("app_versions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setVersions(data || []);
    } catch (error) { console.error("Error fetching versions:", error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchVersions(); }, [fetchVersions]);

  const formatFileSize = (bytes: number | null) => { if (!bytes) return "N/A"; return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; };
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const handleSetActive = async (id: string) => {
    try {
      await supabase.from("app_versions").update({ is_active: false }).neq("id", "");
      await supabase.from("app_versions").update({ is_active: true }).eq("id", id);
      toast({ title: "Versão ativada!", description: "A versão foi definida como ativa." });
      fetchVersions(); refetch();
    } catch (error) { console.error("Error:", error); }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm("Tem certeza que deseja excluir esta versão?")) return;
    try {
      await supabase.storage.from("app-files").remove([fileName]);
      await supabase.from("app_versions").delete().eq("id", id);
      toast({ title: "Versão excluída!", description: "A versão foi removida com sucesso." });
      fetchVersions(); refetch();
    } catch (error) { console.error("Error:", error); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileArchive className="w-6 h-6 text-primary" />Versões do App</h1>
        <p className="text-muted-foreground mt-1">Gerencie todas as versões do aplicativo</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Carregando...</p>
        ) : versions.length === 0 ? (
          <div className="text-center py-12">
            <FileArchive className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma versão cadastrada</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Faça o upload da primeira versão do app</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div key={version.id} className={`p-4 rounded-xl border ${version.is_active ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${version.is_active ? "gradient-primary" : "bg-muted"}`}>
                      <FileArchive className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">v{version.version}</h3>
                        {version.is_active && (<span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Ativa</span>)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{formatFileSize(version.file_size)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(version.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(version.file_url, "_blank")} className="border-border text-foreground hover:bg-muted"><Download className="w-4 h-4 mr-1" />Baixar</Button>
                    {!version.is_active && (<Button variant="outline" size="sm" onClick={() => handleSetActive(version.id)} className="border-primary text-primary hover:bg-primary/10"><CheckCircle className="w-4 h-4 mr-1" />Ativar</Button>)}
                    <Button variant="outline" size="sm" onClick={() => handleDelete(version.id, version.file_name)} className="border-destructive text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
