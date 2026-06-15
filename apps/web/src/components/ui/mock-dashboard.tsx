import { useEffect, useState } from "react";
import {
  Activity,
  ShieldCheck,
  Terminal,
  ShieldAlert,
  Cpu,
  AlertTriangle,
  FileCode,
  Server,
  Network,
} from "lucide-react";
import { motion } from "framer-motion";

export const MockDashboard = () => {
  const [chartData, setChartData] = useState<number[]>(Array(20).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const next = [...prev.slice(1), 20 + Math.random() * 60];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#050505]/95 shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden backdrop-blur-3xl flex flex-col font-sans relative">
      {}
      <div className="h-14 border-b border-white/5 bg-[#0a0a0e]/80 flex items-center px-4 justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500/90 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/90 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-mono text-emerald-500/90 uppercase tracking-[0.2em] flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> SECURE TUNNEL ACTIVE
        </div>
        <div className="flex gap-4 text-slate-500">
          <Server className="w-4 h-4" />
          <Network className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-[550px] md:h-[620px] relative z-10">
        {}
        <div className="hidden md:flex w-20 border-r border-white/5 bg-[#050505]/80 flex-col items-center py-6 gap-8 relative z-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="p-3 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="p-3 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="p-3 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all cursor-pointer mt-auto mb-4">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {}
        <div className="flex-1 p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 relative overflow-x-hidden md:overflow-hidden">
          {}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>

          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          {}
          <div className="flex justify-between items-end relative z-10">
            <div>
              <h1 className="text-3xl font-semibold text-white tracking-tight drop-shadow-lg">
                Global Threat Grid
              </h1>
              <p className="text-emerald-500/70 mt-1 font-mono text-sm">
                Real-time heuristic analysis pipeline.
              </p>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            {}
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0e]/80 p-5 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-sm font-mono text-slate-400 uppercase tracking-widest">
                  Analysis Speed
                </div>
              </div>
              <div className="text-4xl font-light text-white tracking-tight">
                4.2<span className="text-lg text-emerald-500 ml-1">MB/s</span>
              </div>

              {}
              <div className="mt-4 h-8 flex items-end gap-1 opacity-80">
                {chartData.map((val, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-emerald-500/40 rounded-t-sm"
                    style={{ height: `${val}%` }}
                    transition={{ type: "spring" }}
                  />
                ))}
              </div>
            </div>

            {}
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0e]/80 p-5 backdrop-blur-md relative overflow-hidden group hover:border-red-500/50 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-sm font-mono text-slate-400 uppercase tracking-widest">
                  Zero-days Found
                </div>
              </div>
              <div className="text-4xl font-light text-white tracking-tight text-shadow">
                2
              </div>
              <div className="mt-4 text-xs font-mono text-red-400 bg-red-500/10 inline-block px-2 py-1 rounded">
                Last 24 hours
              </div>
            </div>

            {}
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0e]/80 p-5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/50 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-sm font-mono text-slate-400 uppercase tracking-widest">
                  Heuristic Models
                </div>
              </div>
              <div className="text-4xl font-light text-white tracking-tight">
                14
              </div>
              <div className="mt-4 text-xs font-mono text-cyan-400 bg-cyan-500/10 inline-block px-2 py-1 rounded">
                Active
              </div>
            </div>
          </div>

          {}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 min-h-0">
            {}
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0a0a0e]/80 flex flex-col backdrop-blur-md overflow-hidden">
              <div className="border-b border-white/5 bg-white/5 px-6 py-4 flex justify-between items-center">
                <span className="text-sm font-mono text-slate-300 uppercase tracking-widest">
                  Live Intercepts
                </span>
                <span className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>{" "}
                  Streaming
                </span>
              </div>
              <div className="flex-1 overflow-hidden p-2">
                {[
                  {
                    name: "com.android.calculator2",
                    risk: "2/100",
                    status: "Clean",
                    time: "2m ago",
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                  {
                    name: "com.whatsapp.update.apk",
                    risk: "98/100",
                    status: "Quarantined",
                    time: "5m ago",
                    color: "text-red-400",
                    bg: "bg-red-500/10 border-red-500/30 bg-red-500/5 shadow-[0_0_15px_rgba(248,113,113,0.15)]",
                  },
                  {
                    name: "org.telegram.messenger",
                    risk: "15/100",
                    status: "Clean",
                    time: "12m ago",
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center px-4 py-4 rounded-xl mb-1 border border-transparent transition-all ${i === 1 ? "border-red-500/20 bg-red-500/5" : "hover:bg-white/5 hover:border-white/10"}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 w-1/2 sm:w-2/5">
                      <FileCode
                        className={`shrink-0 w-4 h-4 sm:w-5 sm:h-5 ${i === 1 ? "text-red-400" : "text-slate-500"}`}
                      />
                      <span
                        className={`text-xs sm:text-sm font-mono truncate ${i === 1 ? "text-red-300" : "text-slate-300"}`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`hidden sm:block w-1/5 text-sm font-semibold ${item.color}`}
                    >
                      {item.risk}
                    </span>
                    <span className="w-1/2 sm:w-1/4 flex justify-end sm:justify-start">
                      <span
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-mono border ${item.bg} ${item.color}`}
                      >
                        {item.status}
                      </span>
                    </span>
                    <span className="hidden sm:block w-1/6 text-right text-xs font-mono text-slate-500">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="lg:col-span-1 rounded-2xl border border-emerald-500/20 bg-[#0a0a0e]/80 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)] py-8 lg:py-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]"></div>

              <div className="relative w-40 h-40 shrink-0 rounded-full border border-emerald-500/40 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 m-4"></div>
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 m-8"></div>
                <div className="absolute w-px h-full bg-emerald-500/20"></div>
                <div className="absolute h-px w-full bg-emerald-500/20"></div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 70%, rgba(16,185,129,0.5) 100%)",
                  }}
                />

                <ShieldAlert className="w-8 h-8 text-emerald-400 relative z-10 shadow-emerald-500" />
              </div>

              <div className="mt-6 text-center z-10">
                <div className="text-emerald-400 font-mono text-sm tracking-widest uppercase">
                  Deep Scan
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Analyzing anomalies...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
