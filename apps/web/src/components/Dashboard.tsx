import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  AlertTriangle,
  CheckSquare,
  Code,
  FileText,
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface MaliciousCapability {
  capability: string;
  proof: string;
}

export interface AIRiskReport {
  executive_summary: string;
  risk_score: number;
  threat_classification: string;
  malicious_capabilities: MaliciousCapability[];
  actionable_recommendations_for_bank: string[];
  install_verdict?: "YES" | "NO" | "CAUTION";
  install_guidelines?: string[];
}

interface DashboardProps {
  report: AIRiskReport;
  packageName?: string;
}

const getRiskStyle = (score: number) => {
  if (score >= 70) {
    return {
      label: "Critical risk",
      color: "#e11d48",
      soft: "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]",
      panel: "from-red-500/10 to-[#0a0a0e] border-red-500/20",
    };
  }

  if (score >= 40) {
    return {
      label: "Elevated risk",
      color: "#eab308",
      soft: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
      panel: "from-yellow-500/10 to-[#0a0a0e] border-yellow-500/20",
    };
  }

  return {
    label: "Low risk",
    color: "#10b981",
    soft: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    panel: "from-emerald-500/10 to-[#0a0a0e] border-emerald-500/20",
  };
};

import { motion } from "framer-motion";

export const Dashboard = ({
  report,
  packageName = "com.unknown.app",
}: DashboardProps) => {
  const risk = getRiskStyle(report.risk_score);
  const isHighRisk = report.risk_score >= 70;

  const derivedVerdict =
    report.install_verdict ||
    (report.risk_score < 50
      ? "YES"
      : report.risk_score < 80
        ? "CAUTION"
        : "NO");
  const derivedGuidelines =
    report.install_guidelines ||
    (report.risk_score < 50
      ? [
          "No severe malware behaviors were detected. It is safe to proceed with the installation.",
        ]
      : report.risk_score < 80
        ? [
            "The app is acceptable to keep, but users should review sensitive permissions (e.g., SMS, Contacts) and monitor for unusual battery drain.",
          ]
        : [
            "Critical Threat Detected. High risk of dangerous behaviors like screen overlays or data exfiltration. Immediate removal/blocking is advised.",
          ]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 space-y-4 sm:space-y-6 duration-500">
      <section
        className={`overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br ${risk.panel} shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-2xl`}
      >
        <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
          <div className="border-b border-white/10 bg-[#0a0a0e]/40 p-6 sm:p-8 backdrop-blur-md lg:border-b-0 lg:border-r">
            <div className="mx-auto h-32 w-32 sm:h-40 sm:w-40">
              <CircularProgressbar
                value={report.risk_score ?? 0}
                text={`${report.risk_score ?? 0}`}
                styles={buildStyles({
                  pathColor: risk.color,
                  textColor: risk.color,
                  trailColor: "rgba(255,255,255,0.1)",
                  textSize: "28px",
                  pathTransitionDuration: 1.2,
                })}
              />
            </div>
            <div className="mt-4 sm:mt-5 text-center">
              <span
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs sm:text-sm font-semibold ${risk.soft}`}
              >
                {isHighRisk ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {risk.label}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a0a0e] px-3 py-2 text-[11px] sm:text-sm font-medium text-slate-300 shadow-sm overflow-hidden w-full sm:w-auto">
                <Code className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate font-mono">{packageName}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a0a0e] px-3 py-2 text-[11px] sm:text-sm font-medium text-slate-300 shadow-sm w-full sm:w-auto">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{(report.malicious_capabilities || []).length} threat vectors</span>
              </span>
            </div>

            <p className="text-[11px] sm:text-sm font-semibold uppercase text-slate-400 tracking-wider">
              Threat classification
            </p>
            <h1 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
              {report.threat_classification || "Unknown Classification"}
            </h1>
            <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-relaxed sm:leading-7 text-slate-400">
              Review the risk score, evidence-backed capabilities, and
              recommended mitigation actions for this APK package.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              <div className="flex flex-col items-start justify-center rounded-xl border border-white/10 bg-[#0a0a0e] p-3 sm:p-4 shadow-sm">
                <p className="text-[10px] sm:text-xs font-medium uppercase text-slate-400 line-clamp-1 tracking-wider">
                  Risk score
                </p>
                <p className="mt-1 text-lg sm:text-2xl font-semibold text-white">
                  {report.risk_score ?? 0}
                  <span className="text-[10px] sm:text-base text-slate-500 font-normal">/100</span>
                </p>
              </div>
              <div className="flex flex-col items-start justify-center rounded-xl border border-white/10 bg-[#0a0a0e] p-3 sm:p-4 shadow-sm">
                <p className="text-[10px] sm:text-xs font-medium uppercase text-slate-400 line-clamp-1 tracking-wider">
                  Vectors
                </p>
                <p className="mt-1 text-lg sm:text-2xl font-semibold text-white">
                  {(report.malicious_capabilities || []).length}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col items-start justify-center rounded-xl border border-white/10 bg-[#0a0a0e] p-3 sm:p-4 shadow-sm">
                <p className="text-[10px] sm:text-xs font-medium uppercase text-slate-400 line-clamp-1 tracking-wider">
                  Mitigations
                </p>
                <p className="mt-1 text-lg sm:text-2xl font-semibold text-white">
                  {(report.actionable_recommendations_for_bank || []).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`rounded-xl sm:rounded-2xl border p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl ${
          derivedVerdict === "YES"
            ? "bg-emerald-500/10 border-emerald-500/30"
            : derivedVerdict === "CAUTION"
              ? "bg-yellow-500/10 border-yellow-500/30"
              : "bg-rose-500/10 border-rose-500/30"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <span
            className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border ${
              derivedVerdict === "YES"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : derivedVerdict === "CAUTION"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            }`}
          >
            {derivedVerdict === "YES" ? (
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : derivedVerdict === "CAUTION" ? (
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </span>
          <div className="w-full">
            <h2
              className={`text-lg sm:text-xl font-bold mb-2 ${
                derivedVerdict === "YES"
                  ? "text-emerald-400"
                  : derivedVerdict === "CAUTION"
                    ? "text-yellow-400"
                    : "text-rose-400"
              }`}
            >
              {derivedVerdict === "YES"
                ? "Safe to Install"
                : derivedVerdict === "CAUTION"
                  ? "Proceed with Caution"
                  : "DO NOT INSTALL"}
            </h2>
            {derivedGuidelines && derivedGuidelines.length > 0 ? (
              <ul className="list-none sm:list-disc sm:pl-5 space-y-1 text-slate-300 text-xs sm:text-sm leading-relaxed">
                {derivedGuidelines.map((guide, idx) => (
                  <li key={idx} className="flex gap-2 sm:block"><span className="sm:hidden text-slate-500 mt-0.5">•</span><span>{guide}</span></li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {derivedVerdict === "YES"
                  ? "No suspicious activities detected."
                  : derivedVerdict === "CAUTION"
                    ? "Review permissions carefully before using."
                    : "This application exhibits highly malicious behavior."}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0e]/60 p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
        <div className="mb-3 sm:mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Executive summary
          </h2>
        </div>
        <p className="max-w-5xl text-xs sm:text-sm leading-relaxed sm:leading-7 text-slate-400">
          {report.executive_summary ||
            "No executive summary provided for this scan."}
        </p>
      </section>

      {(report.malicious_capabilities || []).length > 0 && (
        <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0e]/60 p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
          <div className="mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
            <h2 className="text-sm sm:text-lg font-semibold text-white">
              Identified threat vectors
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
            {(report.malicious_capabilities || []).map((cap, idx) => (
              <motion.article
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                key={`${cap.capability}-${idx}`}
                className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0e]/80 shadow-sm transition-all hover:shadow-md backdrop-blur-lg"
              >
                <div className="flex items-start gap-3 border-b border-white/5 bg-white/5 p-3 sm:p-4">
                  <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold uppercase text-rose-400 tracking-wider">
                      Vector {idx + 1}
                    </p>
                    <h3 className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-white leading-tight">
                      {cap.capability}
                    </h3>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-400">
                    {cap.proof}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
        <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Recommended mitigations
          </h2>
        </div>
        {(report.actionable_recommendations_for_bank || []).length > 0 ? (
          <ol className="grid gap-3 lg:grid-cols-2">
            {(report.actionable_recommendations_for_bank || []).map(
              (rec, idx) => (
                <li
                  key={`${rec}-${idx}`}
                  className="flex gap-2 sm:gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 sm:p-3"
                >
                  <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-[10px] sm:text-xs font-bold text-emerald-400">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-300">
                    {rec}
                  </span>
                </li>
              ),
            )}
          </ol>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
            <ListChecks className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
            <p className="text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-400">
              No recommendations were returned for this report.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
