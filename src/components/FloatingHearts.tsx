import { Heart } from "lucide-react";

const FloatingHearts = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-[10%] animate-float opacity-10">
        <Heart className="w-8 h-8 text-primary fill-primary" />
      </div>
      <div className="absolute top-40 right-[15%] animate-float-reverse opacity-[0.07]">
        <Heart className="w-12 h-12 text-primary fill-primary" />
      </div>
      <div className="absolute top-[60%] left-[5%] animate-float-slow opacity-[0.05]">
        <Heart className="w-16 h-16 text-primary fill-primary" />
      </div>
      <div className="absolute top-[30%] right-[8%] animate-float opacity-10">
        <Heart className="w-6 h-6 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-40 left-[20%] animate-float-reverse opacity-[0.07]">
        <Heart className="w-10 h-10 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-20 right-[25%] animate-float-slow opacity-[0.05]">
        <Heart className="w-14 h-14 text-primary fill-primary" />
      </div>
    </div>
  );
};

export default FloatingHearts;
