import { useState } from "react";
import { Video, Upload, Download, Trash2, CheckCircle, HardDrive, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTutorialVideo } from "@/contexts/TutorialVideoContext";
import { useToast } from "@/hooks/use-toast";

export default function VideoPage() {
  const { currentVideo, uploadVideo, deleteVideo } = useTutorialVideo();
  const { toast } = useToast();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleUpload = async () => {
    if (!videoFile) {
      toast({ title: "Erro", description: "Selecione um arquivo de vídeo.", variant: "destructive" });
      return;
    }
    setUploadingVideo(true);
    const success = await uploadVideo(videoFile, videoTitle || "Tutorial");
    setUploadingVideo(false);
    if (success) {
      toast({ title: "Vídeo enviado!", description: "O vídeo tutorial foi atualizado com sucesso." });
      setVideoFile(null);
      setVideoTitle("");
    } else {
      toast({ title: "Erro", description: "Não foi possível enviar o vídeo.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6 text-primary" />
          Vídeo Tutorial
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie o vídeo de tutorial exibido no site</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Enviar Novo Vídeo</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Arquivo de Vídeo (.mp4)</Label>
            <Input type="file" accept="video/mp4" onChange={(e) => { if (e.target.files?.[0]) setVideoFile(e.target.files[0]); }} className="bg-card border-border text-foreground file:bg-primary file:text-white file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Título do Vídeo</Label>
            <Input type="text" placeholder="Ex: Tutorial de Instalação" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="bg-card border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="flex items-end">
            <Button variant="hero" onClick={handleUpload} disabled={uploadingVideo || !videoFile} className="w-full">
              {uploadingVideo ? "Enviando..." : (<><Upload className="w-4 h-4 mr-2" />Enviar Vídeo</>)}
            </Button>
          </div>
        </div>
        {videoFile && (
          <div className="p-3 bg-primary/10 rounded-lg flex items-center gap-3">
            <Video className="w-5 h-5 text-primary" />
            <span className="text-sm">{videoFile.name}</span>
            <span className="text-xs text-muted-foreground">({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Vídeo Atual</h2>
        {currentVideo ? (
          <div className="p-4 rounded-xl border border-primary bg-primary/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{currentVideo.title}</h3>
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Ativo</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{currentVideo.file_size ? (currentVideo.file_size / (1024 * 1024)).toFixed(2) + " MB" : "N/A"}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(currentVideo.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(currentVideo.video_url, "_blank")} className="border-border text-foreground hover:bg-muted"><Download className="w-4 h-4 mr-1" />Ver</Button>
                <Button variant="outline" size="sm" onClick={async () => { if (confirm("Tem certeza que deseja excluir este vídeo?")) { const success = await deleteVideo(currentVideo.id); if (success) toast({ title: "Vídeo excluído!", description: "O vídeo foi removido com sucesso." }); } }} className="border-destructive text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Video className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum vídeo tutorial cadastrado</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Faça o upload de um vídeo .mp4 acima</p>
          </div>
        )}
      </div>
    </div>
  );
}
