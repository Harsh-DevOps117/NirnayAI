import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { SignInPage } from "../components/ui/sign-in";
import { CyberVisual } from "../components/ui/cyber-visual";
import { MeshBackground } from "../components/ui/mesh-background";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
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
          onSignIn={handleSignIn}
          onResetPassword={() => toast.info("Password reset flow initiated", { theme: "dark" })}
          onCreateAccount={() => navigate("/register")}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
