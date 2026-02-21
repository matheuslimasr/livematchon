import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TutorialStep {
  id: string;
  step_order: number;
  image_url: string;
  title_pt: string;
  title_en: string;
  title_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TutorialStepsContextType {
  steps: TutorialStep[];
  loading: boolean;
  fetchSteps: () => Promise<void>;
  addStep: (file: File, titles: { pt: string; en: string; es: string }, descriptions: { pt: string; en: string; es: string }) => Promise<boolean>;
  updateStep: (id: string, updates: Partial<TutorialStep>, newImage?: File) => Promise<boolean>;
  deleteStep: (id: string, imageUrl: string) => Promise<boolean>;
  reorderSteps: (steps: TutorialStep[]) => Promise<boolean>;
}

const TutorialStepsContext = createContext<TutorialStepsContextType | undefined>(undefined);

export const TutorialStepsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSteps = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tutorial_steps")
        .select("*")
        .eq("is_active", true)
        .order("step_order", { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error("Error fetching tutorial steps:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const addStep = async (
    file: File,
    titles: { pt: string; en: string; es: string },
    descriptions: { pt: string; en: string; es: string }
  ): Promise<boolean> => {
    try {
      // Upload image
      const fileName = `step-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("tutorial-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("tutorial-images")
        .getPublicUrl(fileName);

      // Get next order
      const nextOrder = steps.length + 1;

      // Insert into database
      const { error: insertError } = await supabase
        .from("tutorial_steps")
        .insert({
          step_order: nextOrder,
          image_url: urlData.publicUrl,
          title_pt: titles.pt,
          title_en: titles.en,
          title_es: titles.es,
          description_pt: descriptions.pt,
          description_en: descriptions.en,
          description_es: descriptions.es,
          is_active: true,
        });

      if (insertError) throw insertError;

      await fetchSteps();
      return true;
    } catch (error) {
      console.error("Error adding tutorial step:", error);
      return false;
    }
  };

  const updateStep = async (
    id: string,
    updates: Partial<TutorialStep>,
    newImage?: File
  ): Promise<boolean> => {
    try {
      let imageUrl = updates.image_url;

      if (newImage) {
        // Upload new image
        const fileName = `step-${Date.now()}-${newImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from("tutorial-images")
          .upload(fileName, newImage, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("tutorial-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("tutorial_steps")
        .update({
          ...updates,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", id);

      if (error) throw error;

      await fetchSteps();
      return true;
    } catch (error) {
      console.error("Error updating tutorial step:", error);
      return false;
    }
  };

  const deleteStep = async (id: string, imageUrl: string): Promise<boolean> => {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      await supabase.storage.from("tutorial-images").remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from("tutorial_steps")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Reorder remaining steps
      const remainingSteps = steps.filter(s => s.id !== id);
      for (let i = 0; i < remainingSteps.length; i++) {
        await supabase
          .from("tutorial_steps")
          .update({ step_order: i + 1 })
          .eq("id", remainingSteps[i].id);
      }

      await fetchSteps();
      return true;
    } catch (error) {
      console.error("Error deleting tutorial step:", error);
      return false;
    }
  };

  const reorderSteps = async (newSteps: TutorialStep[]): Promise<boolean> => {
    try {
      for (let i = 0; i < newSteps.length; i++) {
        await supabase
          .from("tutorial_steps")
          .update({ step_order: i + 1 })
          .eq("id", newSteps[i].id);
      }

      await fetchSteps();
      return true;
    } catch (error) {
      console.error("Error reordering steps:", error);
      return false;
    }
  };

  return (
    <TutorialStepsContext.Provider
      value={{
        steps,
        loading,
        fetchSteps,
        addStep,
        updateStep,
        deleteStep,
        reorderSteps,
      }}
    >
      {children}
    </TutorialStepsContext.Provider>
  );
};

export const useTutorialSteps = () => {
  const context = useContext(TutorialStepsContext);
  if (!context) {
    throw new Error("useTutorialSteps must be used within a TutorialStepsProvider");
  }
  return context;
};
