
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Hammer } from "lucide-react";
import { MeshBackground } from "../components/ui/mesh-background";

export const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-emerald-500/30 flex items-center justify-center font-sans overflow-hidden">
      <MeshBackground />
      
      <div className="relative z-10 p-8 max-w-2xl w-full flex flex-col items-center text-center">
        {/* Glowing Hammer Icon */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
          <div className="p-6 rounded-2xl bg-[#0a0a0e]/80 border border-emerald-500/30 relative shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-md">
            <Hammer className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter mb-4" style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          System Under Construction
        </h1>
        
        <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed text-sm md:text-base">
          This sector of the NirnayAI global threat grid is currently being upgraded. Advanced heuristic pipelines will be deployed here soon.
        </p>

        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-white shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to previous sector
        </button>
      </div>
    </div>
  );
};
