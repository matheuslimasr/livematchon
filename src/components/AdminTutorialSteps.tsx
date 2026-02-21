import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Image,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { useTutorialSteps, TutorialStep } from "@/contexts/TutorialStepsContext";
import { useToast } from "@/hooks/use-toast";

const AdminTutorialSteps = () => {
  const { steps, loading, addStep, updateStep, deleteStep, reorderSteps } = useTutorialSteps();
  const { toast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Add form state
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newTitles, setNewTitles] = useState({ pt: "", en: "", es: "" });
  const [newDescriptions, setNewDescriptions] = useState({ pt: "", en: "", es: "" });

  // Edit form state
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editTitles, setEditTitles] = useState({ pt: "", en: "", es: "" });
  const [editDescriptions, setEditDescriptions] = useState({ pt: "", en: "", es: "" });

  const handleAdd = async () => {
    if (!newImage) {
      toast({ title: "Erro", description: "Selecione uma imagem.", variant: "destructive" });
      return;
    }
    if (!newTitles.pt) {
      toast({ title: "Erro", description: "Preencha pelo menos o título em português.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const success = await addStep(newImage, newTitles, newDescriptions);
    setUploading(false);

    if (success) {
      toast({ title: "Passo adicionado!", description: "O novo passo foi adicionado ao tutorial." });
      setShowAddForm(false);
      setNewImage(null);
      setNewTitles({ pt: "", en: "", es: "" });
      setNewDescriptions({ pt: "", en: "", es: "" });
    } else {
      toast({ title: "Erro", description: "Não foi possível adicionar o passo.", variant: "destructive" });
    }
  };

  const startEdit = (step: TutorialStep) => {
    setEditingId(step.id);
    setEditTitles({ pt: step.title_pt, en: step.title_en, es: step.title_es });
    setEditDescriptions({ pt: step.description_pt, en: step.description_en, es: step.description_es });
    setEditImage(null);
  };

  const handleUpdate = async (step: TutorialStep) => {
    setUploading(true);
    const success = await updateStep(
      step.id,
      {
        title_pt: editTitles.pt,
        title_en: editTitles.en,
        title_es: editTitles.es,
        description_pt: editDescriptions.pt,
        description_en: editDescriptions.en,
        description_es: editDescriptions.es,
      },
      editImage || undefined
    );
    setUploading(false);

    if (success) {
      toast({ title: "Passo atualizado!", description: "As alterações foram salvas." });
      setEditingId(null);
    } else {
      toast({ title: "Erro", description: "Não foi possível atualizar o passo.", variant: "destructive" });
    }
  };

  const handleDelete = async (step: TutorialStep) => {
    if (!confirm(`Tem certeza que deseja excluir o passo ${step.step_order}?`)) return;

    const success = await deleteStep(step.id, step.image_url);
    if (success) {
      toast({ title: "Passo excluído!", description: "O passo foi removido do tutorial." });
    } else {
      toast({ title: "Erro", description: "Não foi possível excluir o passo.", variant: "destructive" });
    }
  };

  const moveStep = async (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    await reorderSteps(newSteps);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-primary-foreground/60">Carregando passos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!showAddForm && (
        <Button
          variant="hero"
          onClick={() => setShowAddForm(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Novo Passo
        </Button>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Novo Passo</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-primary-foreground">Imagem do Passo *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
              />
              {newImage && (
                <div className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/60">
                  <Image className="w-4 h-4" />
                  {newImage.name}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-primary-foreground">Título (PT) *</Label>
                <Input
                  value={newTitles.pt}
                  onChange={(e) => setNewTitles({ ...newTitles, pt: e.target.value })}
                  placeholder="Ex: 1. Clique em Baixar"
                  className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                />
              </div>
              <div>
                <Label className="text-primary-foreground">Título (EN)</Label>
                <Input
                  value={newTitles.en}
                  onChange={(e) => setNewTitles({ ...newTitles, en: e.target.value })}
                  placeholder="Ex: 1. Click Download"
                  className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                />
              </div>
              <div>
                <Label className="text-primary-foreground">Título (ES)</Label>
                <Input
                  value={newTitles.es}
                  onChange={(e) => setNewTitles({ ...newTitles, es: e.target.value })}
                  placeholder="Ex: 1. Haz clic en Descargar"
                  className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-primary-foreground">Descrição (PT)</Label>
                <Textarea
                  value={newDescriptions.pt}
                  onChange={(e) => setNewDescriptions({ ...newDescriptions, pt: e.target.value })}
                  placeholder="Descrição em português..."
                  className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-primary-foreground">Descrição (EN)</Label>
                <Textarea
                  value={newDescriptions.en}
                  onChange={(e) => setNewDescriptions({ ...newDescriptions, en: e.target.value })}
                  placeholder="Description in English..."
                  className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-primary-foreground">Descrição (ES)</Label>
                <Textarea
                  value={newDescriptions.es}
                  onChange={(e) => setNewDescriptions({ ...newDescriptions, es: e.target.value })}
                  placeholder="Descripción en español..."
                  className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button variant="hero" onClick={handleAdd} disabled={uploading}>
                {uploading ? "Salvando..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Passo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Steps List */}
      {steps.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-primary-foreground/30 mx-auto mb-4" />
          <p className="text-primary-foreground/60">Nenhum passo do tutorial cadastrado</p>
          <p className="text-sm text-primary-foreground/40 mt-2">
            Clique em "Adicionar Novo Passo" para começar
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="bg-primary-foreground/5 rounded-xl border border-primary-foreground/10 overflow-hidden"
            >
              {editingId === step.id ? (
                // Edit Mode
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">Editando Passo {step.step_order}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={step.image_url}
                      alt={`Passo ${step.step_order}`}
                      className="w-24 h-40 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Label className="text-primary-foreground">Nova Imagem (opcional)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                        className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-primary-foreground">Título (PT)</Label>
                      <Input
                        value={editTitles.pt}
                        onChange={(e) => setEditTitles({ ...editTitles, pt: e.target.value })}
                        className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-foreground">Título (EN)</Label>
                      <Input
                        value={editTitles.en}
                        onChange={(e) => setEditTitles({ ...editTitles, en: e.target.value })}
                        className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-foreground">Título (ES)</Label>
                      <Input
                        value={editTitles.es}
                        onChange={(e) => setEditTitles({ ...editTitles, es: e.target.value })}
                        className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-primary-foreground">Descrição (PT)</Label>
                      <Textarea
                        value={editDescriptions.pt}
                        onChange={(e) => setEditDescriptions({ ...editDescriptions, pt: e.target.value })}
                        className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-primary-foreground">Descrição (EN)</Label>
                      <Textarea
                        value={editDescriptions.en}
                        onChange={(e) => setEditDescriptions({ ...editDescriptions, en: e.target.value })}
                        className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-primary-foreground">Descrição (ES)</Label>
                      <Textarea
                        value={editDescriptions.es}
                        onChange={(e) => setEditDescriptions({ ...editDescriptions, es: e.target.value })}
                        className="mt-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                    <Button variant="hero" onClick={() => handleUpdate(step)} disabled={uploading}>
                      {uploading ? "Salvando..." : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-4 p-4">
                  {/* Reorder Controls */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(index, "up")}
                      disabled={index === 0}
                      className="p-1 h-auto"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <GripVertical className="w-4 h-4 text-primary-foreground/40 mx-auto" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(index, "down")}
                      disabled={index === steps.length - 1}
                      className="p-1 h-auto"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image */}
                  <img
                    src={step.image_url}
                    alt={`Passo ${step.step_order}`}
                    className="w-16 h-28 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                        {step.step_order}
                      </span>
                      <h4 className="font-bold truncate">{step.title_pt || "Sem título"}</h4>
                    </div>
                    <p className="text-sm text-primary-foreground/60 line-clamp-2">
                      {step.description_pt || "Sem descrição"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(step)}
                      className="border-primary-foreground/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(step)}
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTutorialSteps;
