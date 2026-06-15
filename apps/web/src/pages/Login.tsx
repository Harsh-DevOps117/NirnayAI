import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { SignInPage, type Testimonial } from "../components/ui/sign-in";
import { CyberVisual } from "../components/ui/cyber-visual";
import { MeshBackground } from "../components/ui/mesh-background";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
    name: "Dr. Sarah Chen",
    handle: "@sarahdigital",
    text: "NirnayAI's autonomous threat hunting completely transformed how we analyze Android binaries. Unparalleled accuracy."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "The speed at which it decodes malicious intent is incredible. A must-have tool for modern security teams."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
    name: "David Martinez",
    handle: "@davidsec",
    text: "Deep malware analysis has never been this accessible. The UI is gorgeous and the AI insights are incredibly deep."
  },
];

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/auth/login", { email, password });
      if (response.data.success) {
        toast.success("Authorization granted", { theme: "dark" });
        login(response.data.data.accessToken, response.data.data.refreshToken, response.data.data.user);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication failed. Intrusion logged.", { theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <MeshBackground />
      <div className="relative z-10">
        <SignInPage
          title={<span className="font-semibold text-white tracking-tighter">Establish Connection</span>}
          description="Authenticate to access the NirnayAI global threat grid. Upload binaries, decode malicious intent, and track advanced persistent threats in real-time."
          rightPanelContent={<CyberVisual />}
          onSignIn={handleLoginSubmit}
          onGoogleSignIn={() => toast.info("Google sign-in initialized...", { theme: "dark" })}
          onResetPassword={() => toast.info("Password reset initiated", { theme: "dark" })}
          onCreateAccount={() => navigate("/register")}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
