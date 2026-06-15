import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  rightPanelContent?: React.ReactNode;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-emerald-500/50 focus-within:bg-emerald-500/10">
    {children}
  </div>
);

const TestimonialCard = ({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: string;
}) => (
  <div
    className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-[#0a0a0e]/60 backdrop-blur-xl border border-white/10 p-5 w-64 shadow-[0_8px_30px_rgb(0,0,0,0.4)]`}
  >
    <img
      src={testimonial.avatarSrc}
      className="h-10 w-10 object-cover rounded-2xl"
      alt="avatar"
    />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium text-white">
        {testimonial.name}
      </p>
      <p className="text-slate-400">{testimonial.handle}</p>
      <p className="mt-1 text-slate-300">{testimonial.text}</p>
    </div>
  </div>
);

export const SignInPage: React.FC<SignInPageProps> = ({
  title = (
    <span className="font-semibold text-white tracking-tighter">
      Establish Connection
    </span>
  ),
  description = "Access the NirnayAI global threat intelligence grid",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onResetPassword,
  onCreateAccount,
  isLoading = false,
  children,
  footerText = "New to our platform?",
  footerLinkText = "Request Access",
  rightPanelContent,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans w-full bg-[#050505] text-slate-200 selection:bg-emerald-500/30">
      {}
      <section className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
              {title}
            </h1>
            <p className="animate-element animate-delay-200 text-slate-400">
              {description}
            </p>

            <form className="space-y-5" onSubmit={onSignIn}>
              {children}
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-slate-400">
                  Operator ID (Email)
                </label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="analyst@nirnay.ai"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-slate-600"
                    required
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-slate-400">
                  Passphrase
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your passphrase"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-slate-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="custom-checkbox"
                  />
                  <span className="text-slate-300">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onResetPassword?.();
                  }}
                  className="hover:underline text-emerald-400 transition-colors"
                >
                  Reset passphrase
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="animate-element animate-delay-600 w-full rounded-2xl bg-emerald-500/10 border border-emerald-500/30 py-4 font-medium text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            <p className="animate-element animate-delay-900 text-center text-sm text-slate-400">
              {footerText}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCreateAccount?.();
                }}
                className="text-emerald-400 hover:underline transition-colors"
              >
                {footerLinkText}
              </a>
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="hidden md:block flex-1 relative p-4">
        {rightPanelContent ? (
          rightPanelContent
        ) : heroImageSrc ? (
          <>
            <div
              className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-contain bg-no-repeat bg-center border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] bg-[#0a0a0e]/40"
              style={{ backgroundImage: `url(${heroImageSrc})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent rounded-3xl"></div>
            </div>
            {testimonials.length > 0 && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
                <TestimonialCard
                  testimonial={testimonials[0]}
                  delay="animate-delay-1000"
                />
                {testimonials[1] && (
                  <div className="hidden xl:flex">
                    <TestimonialCard
                      testimonial={testimonials[1]}
                      delay="animate-delay-1200"
                    />
                  </div>
                )}
                {testimonials[2] && (
                  <div className="hidden 2xl:flex">
                    <TestimonialCard
                      testimonial={testimonials[2]}
                      delay="animate-delay-1400"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </section>
    </div>
  );
};
