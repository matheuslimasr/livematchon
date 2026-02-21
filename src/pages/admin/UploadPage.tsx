import { useState } from "react";
import { Upload, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAppVersion } from "@/contexts/AppVersionContext";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const { refetch } = useAppVersion();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast({ title: "Erro", description: "Selecione um arquivo.", variant: "destructive" }); return; }
    const versionMatch = selectedFile.name.match(/(\d+\.\d+\.\d+)/);
    const extractedVersion = versionMatch ? versionMatch[1] : new Date().toISOString().slice(0, 10);
    setUploading(true);
    try {
      const uniqueId = Math.floor(Math.random() * 900000 + 100000);
      const fileName = `${uniqueId}_lovematch.apk`;
      const { error: uploadError } = await supabase.storage.from("app-files").upload(fileName, selectedFile, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("app-files").getPublicUrl(fileName);
      await supabase.from("app_versions").update({ is_active: false }).eq("is_active", true);
      const { error: insertError } = await supabase.from("app_versions").insert({ version: extractedVersion, file_url: urlData.publicUrl, file_name: fileName, file_size: selectedFile.size, is_active: true });
      if (insertError) throw insertError;
      toast({ title: "Upload realizado!", description: `Versão ${extractedVersion} enviada com sucesso.` });
      setSelectedFile(null);
      refetch();
    } catch (error) {
      console.error("Error uploading:", error);
      toast({ title: "Erro no upload", description: "Não foi possível fazer o upload do arquivo.", variant: "destructive" });
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Upload className="w-6 h-6 text-primary" />Upload de Nova Versão</h1>
        <p className="text-muted-foreground mt-1">Envie uma nova versão do aplicativo</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Arquivo do App (.apk, .ipa, .zip)</Label>
            <Input type="file" accept=".apk,.ipa,.zip" onChange={handleFileChange} className="bg-card border-border text-foreground file:bg-primary file:text-white file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-lg" />
          </div>
          <div className="flex items-end">
            <Button variant="hero" onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full">
              {uploading ? "Enviando..." : (<><Upload className="w-4 h-4 mr-2" />Fazer Upload</>)}
            </Button>
          </div>
        </div>
        {selectedFile && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center gap-3">
            <FileArchive className="w-5 h-5 text-primary" />
            <span className="text-sm">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">({formatFileSize(selectedFile.size)})</span>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Instruções</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• O arquivo deve ser no formato .apk, .ipa ou .zip</li>
          <li>• A versão será extraída automaticamente do nome do arquivo (ex: app-1.0.0.apk)</li>
          <li>• A nova versão será automaticamente definida como ativa</li>
          <li>• Versões anteriores serão desativadas mas não excluídas</li>
        </ul>
      </div>
    </div>
  );
}
