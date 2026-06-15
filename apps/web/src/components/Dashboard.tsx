import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertTriangle, CheckSquare, Code, FileText, ListChecks, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

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
}

interface DashboardProps {
  report: AIRiskReport;
  packageName?: string;
}

const getRiskStyle = (score: number) => {
  if (score >= 70) {
    return {
      label: 'Critical risk',
      color: '#e11d48',
      soft: 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]',
      panel: 'from-red-500/10 to-[#0a0a0e] border-red-500/20',
    };
  }

  if (score >= 40) {
    return {
      label: 'Elevated risk',
      color: '#eab308',
      soft: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
      panel: 'from-yellow-500/10 to-[#0a0a0e] border-yellow-500/20',
    };
  }

  return {
    label: 'Low risk',
    color: '#10b981',
    soft: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    panel: 'from-emerald-500/10 to-[#0a0a0e] border-emerald-500/20',
  };
};

import { motion } from 'framer-motion';

export const Dashboard = ({ report, packageName = 'com.unknown.app' }: DashboardProps) => {
  const risk = getRiskStyle(report.risk_score);
  const isHighRisk = report.risk_score >= 70;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <section className={`overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${risk.panel} shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-2xl`}>
        <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
          <div className="border-b border-white/10 bg-[#0a0a0e]/40 p-8 backdrop-blur-md lg:border-b-0 lg:border-r">
            <div className="mx-auto h-40 w-40">
              <CircularProgressbar
                value={report.risk_score ?? 0}
                text={`${report.risk_score ?? 0}`}
                styles={buildStyles({
                  pathColor: risk.color,
                  textColor: risk.color,
                  trailColor: 'rgba(255,255,255,0.1)',
                  textSize: '28px',
                  pathTransitionDuration: 1.2,
                })}
              />
            </div>
            <div className="mt-5 text-center">
              <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${risk.soft}`}>
                {isHighRisk ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                {risk.label}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-[#0a0a0e] px-3 py-2 text-sm font-medium text-slate-300 shadow-sm">
                <Code className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate font-mono">{packageName}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a0a0e] px-3 py-2 text-sm font-medium text-slate-300 shadow-sm">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                {(report.malicious_capabilities || []).length} threat vectors
              </span>
            </div>

            <p className="text-sm font-semibold uppercase text-slate-400">Threat classification</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-semibold tracking-tight text-white">{report.threat_classification || 'Unknown Classification'}</h1>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400">
              Review the risk score, evidence-backed capabilities, and recommended mitigation actions for this APK package.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-[#0a0a0e] p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-slate-400">Risk score</p>
                <p className="mt-2 text-2xl font-semibold text-white">{report.risk_score ?? 0}/100</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0a0a0e] p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-slate-400">Vectors</p>
                <p className="mt-2 text-2xl font-semibold text-white">{(report.malicious_capabilities || []).length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0a0a0e] p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-slate-400">Mitigations</p>
                <p className="mt-2 text-2xl font-semibold text-white">{(report.actionable_recommendations_for_bank || []).length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0a0a0e]/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl sm:p-8">
        <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <FileText className="h-5 w-5 text-slate-400" />
          <h2 className="text-base font-semibold text-white">Executive summary</h2>
        </div>
        <p className="max-w-5xl text-sm leading-7 text-slate-400 sm:text-base">{report.executive_summary || 'No executive summary provided for this scan.'}</p>
      </section>

      {(report.malicious_capabilities || []).length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-[#0a0a0e]/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h2 className="text-lg font-semibold text-white">Identified threat vectors</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(report.malicious_capabilities || []).map((cap, idx) => (
              <motion.article 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                key={`${cap.capability}-${idx}`} 
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0e]/80 shadow-sm transition-all hover:shadow-md backdrop-blur-lg"
              >
                <div className="flex items-start gap-3 border-b border-white/5 bg-white/5 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Zap className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase text-rose-400">Vector {idx + 1}</p>
                    <h3 className="mt-1 text-sm font-semibold text-white">{cap.capability}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-6 text-slate-400">{cap.proof}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl sm:p-8">
        <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <CheckSquare className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-white">Recommended mitigations</h2>
        </div>
        {(report.actionable_recommendations_for_bank || []).length > 0 ? (
          <ol className="grid gap-3 lg:grid-cols-2">
            {(report.actionable_recommendations_for_bank || []).map((rec, idx) => (
              <li key={`${rec}-${idx}`} className="flex gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">{idx + 1}</span>
                <span className="text-sm leading-6 text-slate-300">{rec}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
            <ListChecks className="mt-0.5 h-5 w-5 text-slate-400" />
            <p className="text-sm leading-6 text-slate-400">No recommendations were returned for this report.</p>
          </div>
        )}
      </section>
    </div>
  );
};
