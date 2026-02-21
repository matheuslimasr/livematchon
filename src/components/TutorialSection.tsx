import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { useTutorialVideo } from "@/contexts/TutorialVideoContext";
import videoThumbnail from "@/assets/video-thumbnail.jpg";

const TutorialSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentVideo, loading } = useTutorialVideo();

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-20 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-4">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">TUTORIAL EM VÍDEO</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como instalar o <span className="text-primary">LoveMatch</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Assista ao vídeo tutorial completo e aprenda a instalar o app em poucos minutos
          </p>
        </div>

        {/* Video Player */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <div className="aspect-video relative bg-foreground">
              {currentVideo?.video_url ? (
                <video
                  ref={videoRef}
                  src={currentVideo.video_url}
                  className="w-full h-full object-cover"
                  poster={videoThumbnail}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              ) : (
                <img 
                  src={videoThumbnail} 
                  alt="Tutorial de instalação"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Gradient Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              )}
              
              {/* Play Button */}
              {currentVideo?.video_url && (
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                  <button 
                    className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-all duration-300"
                    onClick={handlePlayClick}
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10 text-primary-foreground" fill="currentColor" />
                    ) : (
                      <Play className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" />
                    )}
                  </button>
                </div>
              )}

              {/* Video Info Overlay */}
              {!isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div>
                    <h3 className="text-xl font-bold text-primary-foreground mb-1">
                      {currentVideo?.title || "Tutorial Completo de Instalação"}
                    </h3>
                    <p className="text-primary-foreground/70 text-sm">
                      {loading ? "Carregando..." : currentVideo ? "Clique para assistir" : "Vídeo em breve"}
                    </p>
                  </div>
                </div>
              )}

              {/* HD Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="bg-primary px-3 py-1.5 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-primary-foreground">HD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
