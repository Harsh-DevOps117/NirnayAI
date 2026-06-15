import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { SignInPage } from "../components/ui/sign-in";
import { CyberVisual } from "../components/ui/cyber-visual";
import { MeshBackground } from "../components/ui/mesh-background";

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-emerald-500/50 focus-within:bg-emerald-500/10">
    {children}
  </div>
);

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password || !name) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/auth/register", { name, email, password });
      if (response.data.success) {
        toast.success("Profile created. Securing connection...", { theme: "dark" });

        const loginRes = await axios.post("/auth/login", { email, password });
        if (loginRes.data.success) {
          login(loginRes.data.data.accessToken, loginRes.data.data.refreshToken, loginRes.data.data.user);
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.", { theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <MeshBackground />
      <div className="relative z-10">
        <SignInPage
          title={<span className="font-semibold text-white tracking-tighter">Initialize Access</span>}
          description="Request clearance to access the NirnayAI platform. Register your identity to unlock dynamic analysis and AI threat decoding."
          rightPanelContent={<CyberVisual />}
          onSignIn={handleRegisterSubmit}
          onCreateAccount={() => navigate("/login")}
          isLoading={isLoading}
          footerText="Already have clearance?"
          footerLinkText="Initiate Login Sequence"
        >
          <div className="animate-element animate-delay-200">
            <label className="text-sm font-medium text-slate-400">Codename / Full Name</label>
            <GlassInputWrapper>
              <input name="name" type="text" placeholder="Operator Jane" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-slate-600" required />
            </GlassInputWrapper>
          </div>
        </SignInPage>
      </div>
    </div>
  );
};
