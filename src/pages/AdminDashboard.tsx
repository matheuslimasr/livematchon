import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  LogOut, 
  Upload, 
  Download, 
  Trash2, 
  FileArchive,
  CheckCircle,
  Clock,
  HardDrive,
  Globe,
  Video,
  Image
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useAppVersion } from "@/contexts/AppVersionContext";
import { useLanguage, Language, languageNames } from "@/contexts/LanguageContext";
import { useTutorialVideo } from "@/contexts/TutorialVideoContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnalyticsSection from "@/components/AnalyticsSection";
import AdminTutorialSteps from "@/components/AdminTutorialSteps";

interface AppVersion {
  id: string;
  version: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  is_active: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdmin();
  const { refetch } = useAppVersion();
  const { language, setLanguage } = useLanguage();
  const { currentVideo, uploadVideo, deleteVideo, refetch: refetchVideo } = useTutorialVideo();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Tutorial video states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const fetchVersions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("app_versions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    fetchVersions();
  }, [isAuthenticated, navigate, fetchVersions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo.",
        variant: "destructive",
      });
      return;
    }

    // Extract version from filename (e.g., "app-1.0.0.apk" -> "1.0.0")
    const versionMatch = selectedFile.name.match(/(\d+\.\d+\.\d+)/);
    const extractedVersion = versionMatch ? versionMatch[1] : new Date().toISOString().slice(0, 10);

    setUploading(true);

    try {
      // Upload file to storage
      const uniqueId = Math.floor(Math.random() * 900000 + 100000);
      const fileName = `${uniqueId}_lovematch.apk`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("app-files")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("app-files")
        .getPublicUrl(fileName);

      // Deactivate all previous versions
      await supabase
        .from("app_versions")
        .update({ is_active: false })
        .eq("is_active", true);

      // Insert new version
      const { error: insertError } = await supabase
        .from("app_versions")
        .insert({
          version: extractedVersion,
          file_url: urlData.publicUrl,
          file_name: fileName,
          file_size: selectedFile.size,
          is_active: true,
        });

      if (insertError) throw insertError;

      toast({
        title: "Upload realizado!",
        description: `Versão ${extractedVersion} enviada com sucesso.`,
      });

      setSelectedFile(null);
      fetchVersions();
      refetch();
    } catch (error) {
      console.error("Error uploading:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer o upload do arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      // Deactivate all versions
      await supabase
        .from("app_versions")
        .update({ is_active: false })
        .neq("id", "");

      // Activate selected version
      await supabase
        .from("app_versions")
        .update({ is_active: true })
        .eq("id", id);

      toast({
        title: "Versão ativada!",
        description: "A versão foi definida como ativa.",
      });

      fetchVersions();
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm("Tem certeza que deseja excluir esta versão?")) return;

    try {
      // Delete from storage
      await supabase.storage.from("app-files").remove([fileName]);

      // Delete from database
      await supabase.from("app_versions").delete().eq("id", id);

      toast({
        title: "Versão excluída!",
        description: "A versão foi removida com sucesso.",
      });

      fetchVersions();
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-foreground text-primary-foreground">
      {/* Header */}
      <header className="border-b border-primary-foreground/10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">LoveMatch</h1>
              <p className="text-xs text-primary-foreground/60">Painel de Controle</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Ver Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        {/* Language Section */}
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Idioma do Site
          </h2>

          <div className="flex flex-wrap gap-3">
            {(["pt", "pt-pt", "en", "es"] as Language[]).map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? "hero" : "outline"}
                onClick={() => {
                  setLanguage(lang);
                  toast({
                    title: "Idioma alterado!",
                    description: `O site agora está em ${languageNames[lang]}.`,
                  });
                }}
                className={language !== lang ? "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" : ""}
              >
                {languageNames[lang]}
              </Button>
            ))}
          </div>
        </div>

        {/* Tutorial Video Section */}
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Vídeo Tutorial
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-primary-foreground">Arquivo de Vídeo (.mp4)</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setVideoFile(e.target.files[0]);
                  }
                }}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground file:bg-primary file:text-primary-foreground file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-primary-foreground">Título do Vídeo</Label>
              <Input
                type="text"
                placeholder="Ex: Tutorial de Instalação"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="hero"
                onClick={async () => {
                  if (!videoFile) {
                    toast({
                      title: "Erro",
                      description: "Selecione um arquivo de vídeo.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setUploadingVideo(true);
                  const success = await uploadVideo(videoFile, videoTitle || "Tutorial");
                  setUploadingVideo(false);
                  if (success) {
                    toast({
                      title: "Vídeo enviado!",
                      description: "O vídeo tutorial foi atualizado com sucesso.",
                    });
                    setVideoFile(null);
                    setVideoTitle("");
                  } else {
                    toast({
                      title: "Erro",
                      description: "Não foi possível enviar o vídeo.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={uploadingVideo || !videoFile}
                className="w-full"
              >
                {uploadingVideo ? "Enviando..." : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Vídeo
                  </>
                )}
              </Button>
            </div>
          </div>

          {videoFile && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center gap-3">
              <Video className="w-5 h-5 text-primary" />
              <span className="text-sm">{videoFile.name}</span>
              <span className="text-xs text-primary-foreground/60">
                ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
          )}

          {currentVideo && (
            <div className="p-4 rounded-xl border border-primary bg-primary/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{currentVideo.title}</h3>
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Ativo
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-primary-foreground/60 mt-1">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {currentVideo.file_size ? (currentVideo.file_size / (1024 * 1024)).toFixed(2) + " MB" : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(currentVideo.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(currentVideo.video_url, "_blank")}
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      if (confirm("Tem certeza que deseja excluir este vídeo?")) {
                        const success = await deleteVideo(currentVideo.id);
                        if (success) {
                          toast({
                            title: "Vídeo excluído!",
                            description: "O vídeo foi removido com sucesso.",
                          });
                        }
                      }
                    }}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!currentVideo && (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-primary-foreground/30 mx-auto mb-4" />
              <p className="text-primary-foreground/60">Nenhum vídeo tutorial cadastrado</p>
              <p className="text-sm text-primary-foreground/40 mt-2">
                Faça o upload de um vídeo .mp4 acima
              </p>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload de Nova Versão
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-primary-foreground">Arquivo do App</Label>
              <Input
                type="file"
                accept=".apk,.ipa,.zip"
                onChange={handleFileChange}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground file:bg-primary file:text-primary-foreground file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-lg"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="hero"
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="w-full"
              >
                {uploading ? (
                  "Enviando..."
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Fazer Upload
                  </>
                )}
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center gap-3">
              <FileArchive className="w-5 h-5 text-primary" />
              <span className="text-sm">{selectedFile.name}</span>
              <span className="text-xs text-primary-foreground/60">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
          )}
        </div>

        {/* Versions List */}
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileArchive className="w-5 h-5 text-primary" />
            Versões do App
          </h2>

          {loading ? (
            <p className="text-center text-primary-foreground/60 py-8">Carregando...</p>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <FileArchive className="w-12 h-12 text-primary-foreground/30 mx-auto mb-4" />
              <p className="text-primary-foreground/60">Nenhuma versão cadastrada</p>
              <p className="text-sm text-primary-foreground/40 mt-2">
                Faça o upload da primeira versão do app acima
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`p-4 rounded-xl border ${
                    version.is_active
                      ? "border-primary bg-primary/10"
                      : "border-primary-foreground/10 bg-primary-foreground/5"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        version.is_active ? "gradient-primary" : "bg-primary-foreground/10"
                      }`}>
                        <FileArchive className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">v{version.version}</h3>
                          {version.is_active && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Ativa
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-primary-foreground/60 mt-1">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {formatFileSize(version.file_size)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(version.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(version.file_url, "_blank")}
                        className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                      {!version.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetActive(version.id)}
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Ativar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(version.id, version.file_name)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tutorial Steps Section */}
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Passos do Tutorial de Instalação
          </h2>
          <AdminTutorialSteps />
        </div>

        {/* Analytics Section */}
        <AnalyticsSection />
      </main>
    </div>
  );
};

export default AdminDashboard;
