import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Terminal, ShieldCheck } from "lucide-react";

export const CyberVisual = () => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const codeLines = [
      "Initializing secure tunnel...",
      "Decrypting payload...",
      "Extracting manifest...",
      "Analyzing API calls...",
      "Threat detected in com.evil.app",
      "Quarantining process...",
      "Analysis complete. 0ms latency.",
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < codeLines.length) {
        setLines((prev) => [...prev, codeLines[currentIndex]]);
        currentIndex++;
      } else {
        setLines([]);
        currentIndex = 0;
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-4 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] bg-[#0a0a0e]/60 overflow-hidden flex flex-col justify-center p-8">
      {}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-6">
        {}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Activity className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Live Traffic
              </span>
            </div>
            <div className="text-3xl font-light text-white">
              42,091<span className="text-sm text-slate-500 ml-1">req/s</span>
            </div>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Threats Blocked
              </span>
            </div>
            <div className="text-3xl font-light text-white">
              8,932<span className="text-sm text-slate-500 ml-1">today</span>
            </div>
          </div>
        </div>

        {}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden">
          {}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

          <div className="relative w-36 h-36 rounded-full border border-emerald-500/30 bg-emerald-950/20 overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            {}
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 m-4"></div>
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 m-8"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/20 -translate-x-1/2"></div>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-emerald-500/20 -translate-y-1/2"></div>

            {}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-full origin-center"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 75%, rgba(16,185,129,0.6) 100%)",
              }}
            />

            {}
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-8 right-10 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"
            ></motion.div>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2.1 }}
              className="absolute bottom-10 left-12 w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,1)]"
            ></motion.div>

            {}
            <ShieldAlert className="h-8 w-8 text-emerald-400 relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>

          <div className="mt-4 text-xs font-mono text-emerald-500/70 tracking-widest uppercase">
            Deep Scan Active
          </div>
        </div>

        {}
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl h-48 font-mono text-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 shrink-0">
            <Terminal className="h-4 w-4 text-slate-500" />
            <span className="text-slate-500 text-xs">system_log.sh</span>
            <div className="ml-auto flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/50"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50"></div>
            </div>
          </div>
          <div className="space-y-1 text-emerald-400/80 flex-1 overflow-hidden">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="text-slate-600 mr-2">
                  [{new Date().toISOString().split("T")[1].slice(0, 8)}]
                </span>
                {line}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-emerald-400 mt-1"
            ></motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
