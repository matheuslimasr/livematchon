import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TutorialVideo {
  id: string;
  title: string;
  video_url: string;
  file_name: string;
  file_size: number | null;
  is_active: boolean;
  created_at: string;
}

interface TutorialVideoContextType {
  currentVideo: TutorialVideo | null;
  loading: boolean;
  refetch: () => Promise<void>;
  uploadVideo: (file: File, title: string) => Promise<boolean>;
  deleteVideo: (id: string) => Promise<boolean>;
}

const TutorialVideoContext = createContext<TutorialVideoContextType | undefined>(undefined);

export const TutorialVideoProvider = ({ children }: { children: ReactNode }) => {
  const [currentVideo, setCurrentVideo] = useState<TutorialVideo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentVideo = async () => {
    try {
      const { data, error } = await supabase
        .from("tutorial_videos")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching tutorial video:", error);
      }
      
      setCurrentVideo(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentVideo();
  }, []);

  const uploadVideo = async (file: File, title: string): Promise<boolean> => {
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `tutorial-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("tutorial-videos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return false;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("tutorial-videos")
        .getPublicUrl(filePath);

      // Deactivate all existing videos
      await supabase
        .from("tutorial_videos")
        .update({ is_active: false })
        .eq("is_active", true);

      // Insert new video record
      const { error: insertError } = await supabase
        .from("tutorial_videos")
        .insert({
          title: title || "Tutorial",
          video_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          is_active: true,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        return false;
      }

      await fetchCurrentVideo();
      return true;
    } catch (error) {
      console.error("Error uploading video:", error);
      return false;
    }
  };

  const deleteVideo = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("tutorial_videos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        return false;
      }

      await fetchCurrentVideo();
      return true;
    } catch (error) {
      console.error("Error deleting video:", error);
      return false;
    }
  };

  const refetch = async () => {
    setLoading(true);
    await fetchCurrentVideo();
  };

  return (
    <TutorialVideoContext.Provider value={{ currentVideo, loading, refetch, uploadVideo, deleteVideo }}>
      {children}
    </TutorialVideoContext.Provider>
  );
};

export const useTutorialVideo = () => {
  const context = useContext(TutorialVideoContext);
  if (!context) {
    throw new Error("useTutorialVideo must be used within a TutorialVideoProvider");
  }
  return context;
};
