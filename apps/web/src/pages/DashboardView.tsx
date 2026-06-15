import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileSearch,
  Loader2,
  LogOut,
  MessageSquareText,
  Radar,
  Search,
  ShieldCheck,
  ShieldEllipsis,
  UploadCloud,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { Dashboard as ReportView, type AIRiskReport } from '../components/Dashboard';
import { WhatsAppConnectModal } from '../components/WhatsAppConnectModal';
import { MeshBackground } from '../components/ui/mesh-background';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

type UploadStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
type ScanRow = {
  id: string;
  filename: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  finalReportJson?: AIRiskReport | null;
};

const cardClass = 'rounded-2xl border border-white/10 bg-[#0a0a0e]/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all duration-300';

const formatDuration = (milliseconds: number) => {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return '--';
  const seconds = Math.round(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const buildDailySeries = (scans: ScanRow[], filter: (scan: ScanRow) => boolean) => {
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (13 - index));
    return date;
  });

  const counts = days.map((day) => {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    return scans.filter((scan) => {
      const createdAt = new Date(scan.createdAt);
      return filter(scan) && createdAt >= day && createdAt < nextDay;
    }).length;
  });

  return counts.some(Boolean) ? counts : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
};

const getPercent = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

const StatusBadge = ({ status }: { status: string }) => {
  const styles =
    status === 'COMPLETED'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
      : status === 'FAILED'
        ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';

  const Icon = status === 'COMPLETED' ? CheckCircle2 : status === 'FAILED' ? XCircle : Loader2;

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium', styles)}>
      <Icon className={cn('h-3.5 w-3.5', status !== 'COMPLETED' && status !== 'FAILED' && 'animate-spin')} />
      {status === 'COMPLETED' ? 'Complete' : status === 'FAILED' ? 'Failed' : 'Analyzing'}
    </span>
  );
};

const Sparkline = ({ data, tone = 'emerald' }: { data: number[]; tone?: 'emerald' | 'rose' | 'amber' }) => {
  const max = Math.max(...data, 1);
  const color = tone === 'rose' ? '#e11d48' : tone === 'amber' ? '#d97706' : '#059669';

  return (
    <div className="mt-4 flex h-8 items-end gap-1">
      {data.map((value, index) => (
        <motion.div
          key={`${value}-${index}`}
          initial={{ height: 4 }}
          animate={{ height: `${Math.max((value / max) * 100, 12)}%` }}
          transition={{ duration: 0.35, delay: index * 0.025 }}
          className="min-w-0 flex-1 rounded-sm bg-[#0a0a0e]/10"
          style={{ backgroundColor: index === data.length - 1 ? color : undefined }}
        />
      ))}
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  trend,
  trendTone,
  icon: Icon,
  data,
}: {
  title: string;
  value: string | number;
  trend: string;
  trendTone: 'emerald' | 'rose' | 'amber';
  icon: LucideIcon;
  data: number[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ duration: 0.3 }}
    className={cn(cardClass, 'p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]')}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-3xl font-semibold tracking-tight text-white">{value}</span>
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold border',
              trendTone === 'rose' && 'bg-red-500/10 text-red-400 border-red-500/20',
              trendTone === 'amber' && 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
              trendTone === 'emerald' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            )}
          >
            {trendTone === 'rose' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        </div>
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0a0a0e]/5 text-slate-400">
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <Sparkline data={data} tone={trendTone} />
  </motion.div>
);

const PipelineStep = ({ label, complete, active }: { label: string; complete: boolean; active?: boolean }) => (
  <div className="flex items-center gap-3">
    <span
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border',
        complete && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        active && !complete && 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
        !complete && !active && 'border-white/10 bg-[#0a0a0e]/5 text-slate-400',
      )}
    >
      {complete ? <CheckCircle2 className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock3 className="h-4 w-4" />}
    </span>
    <span className={cn('text-sm font-medium', complete || active ? 'text-slate-200' : 'text-slate-400')}>{label}</span>
  </div>
);

const RiskGauge = ({ score }: { score: number }) => {
  const normalized = Math.min(Math.max(score, 0), 100);
  const color = normalized >= 70 ? '#e11d48' : normalized >= 35 ? '#d97706' : '#059669';

  return (
    <div className="flex items-center gap-5">
      <div
        className="grid h-32 w-32 place-items-center rounded-full shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        style={{ background: `conic-gradient(${color} ${normalized * 3.6}deg, rgba(255,255,255,0.05) 0deg)` }}
      >
        <div className="grid h-24 w-24 place-items-center rounded-full bg-[#0a0a0e] border border-white/5">
          <div className="text-center">
            <p className="text-3xl font-semibold tracking-tight text-white">{normalized}</p>
            <p className="text-xs font-medium text-slate-400">Avg risk</p>
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">Security pulse</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">Current scan history is trending {normalized >= 70 ? 'critical' : normalized >= 35 ? 'elevated' : 'stable'}.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-white/10 bg-[#0a0a0e]/5 p-2">
            <p className="text-xs font-medium text-slate-400">Static</p>
            <p className="text-sm font-semibold text-emerald-400">Online</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0a0a0e]/5 p-2">
            <p className="text-xs font-medium text-slate-400">Sandbox</p>
            <p className="text-sm font-semibold text-emerald-400">Online</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0a0a0e]/5 p-2">
            <p className="text-xs font-medium text-slate-400">Network</p>
            <p className="text-sm font-semibold text-yellow-400">Watch</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function DashboardView() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [report, setReport] = useState<AIRiskReport | null>(null);
  const [packageName, setPackageName] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [recentScans, setRecentScans] = useState<ScanRow[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await axios.get('/scan/scans');
      setRecentScans(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch scans', err);
    }
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  const pollScanStatus = async (scanId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/scan/status/${scanId}`);
        const status = res.data?.data?.status;

        if (status === 'COMPLETED' && res.data?.data?.finalReportJson) {
          clearInterval(interval);
          setUploadStatus('success');
          setReport(res.data.data.finalReportJson);
          setPackageName(res.data.data.filename);
          fetchScans();
          toast.success('Analysis complete');
        } else if (status === 'FAILED') {
          clearInterval(interval);
          setUploadStatus('error');
          toast.error('Analysis failed');
        }
      } catch (err) {
        clearInterval(interval);
        setUploadStatus('error');
      }
    }, 5000);
  };

  const handleUpload = async (file: File) => {
    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('apk', file);

      const uploadRes = await axios.post('/scan/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const scanId = uploadRes?.data?.data?.id || uploadRes?.data?.id || uploadRes?.data?.scanId;
      if (!scanId) throw new Error(`Invalid response structure: ${JSON.stringify(uploadRes?.data)}`);

      setUploadStatus('analyzing');
      pollScanStatus(scanId);
    } catch (err: any) {
      setUploadStatus('error');
      const errMsg = err.message || err.response?.data?.message || 'Upload failed connecting to API';
      toast.error(errMsg);
      fetchScans();
    }
  };

  const completedScans = recentScans.filter((scan) => scan.status === 'COMPLETED' && scan.finalReportJson);
  const avgScore = useMemo(() => {
    if (completedScans.length === 0) return 0;
    return Math.round(completedScans.reduce((acc, scan) => acc + (scan.finalReportJson?.risk_score || 0), 0) / completedScans.length);
  }, [completedScans]);

  const highRiskCount = completedScans.filter((scan) => (scan.finalReportJson?.risk_score || 0) >= 70).length;
  const mediumRiskCount = completedScans.filter((scan) => {
    const score = scan.finalReportJson?.risk_score || 0;
    return score >= 35 && score < 70;
  }).length;
  const lowRiskCount = completedScans.filter((scan) => (scan.finalReportJson?.risk_score || 0) < 35).length;
  const completedCount = completedScans.length;
  const successRate = recentScans.length > 0 ? Math.round((completedCount / recentScans.length) * 100) : 0;
  const avgDuration = useMemo(() => {
    const durations = completedScans
      .filter((scan) => scan.updatedAt)
      .map((scan) => new Date(scan.updatedAt as string).getTime() - new Date(scan.createdAt).getTime())
      .filter((duration) => Number.isFinite(duration) && duration > 0);

    if (durations.length === 0) return '--';
    return formatDuration(durations.reduce((acc, duration) => acc + duration, 0) / durations.length);
  }, [completedScans]);
  const totalRiskReports = Math.max(completedScans.length, 1);
  const lowRiskPercent = getPercent(lowRiskCount, totalRiskReports);
  const mediumRiskPercent = getPercent(mediumRiskCount, totalRiskReports);
  const highRiskPercent = getPercent(highRiskCount, totalRiskReports);
  const scanSeries = useMemo(() => buildDailySeries(recentScans, () => true), [recentScans]);
  const highRiskSeries = useMemo(() => buildDailySeries(recentScans, (scan) => (scan.finalReportJson?.risk_score || 0) >= 70), [recentScans]);
  const successSeries = useMemo(() => buildDailySeries(recentScans, (scan) => scan.status === 'COMPLETED'), [recentScans]);
  const activeSeries = useMemo(() => buildDailySeries(recentScans, (scan) => scan.status !== 'COMPLETED' && scan.status !== 'FAILED'), [recentScans]);
  const isBusy = uploadStatus === 'uploading' || uploadStatus === 'analyzing';

  const filteredScans = useMemo(() => {
    if (!searchQuery) return recentScans;
    return recentScans.filter(scan => scan.filename.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [recentScans, searchQuery]);

  if (report) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-[#050505] font-sans text-slate-200 selection:bg-emerald-500/30">
        <MeshBackground />
        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => setReport(null)}
            className="mb-5 flex w-max items-center gap-2 rounded-lg border border-white/10 bg-[#0a0a0e] px-3 py-2 text-sm font-semibold text-slate-300 shadow-sm transition hover:border-slate-300 hover:bg-[#0a0a0e]/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </button>
          <ReportView report={report} packageName={packageName} />
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] font-sans text-slate-200 selection:bg-emerald-500/30">
      <MeshBackground />

      <input type="file" accept=".apk" className="hidden" ref={fileInputRef} onChange={onFileSelect} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0a0a0e]/60 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-lg font-bold tracking-tight text-white">NirnayAI</p>
              <p className="text-xs font-medium text-slate-400">Mobile threat analysis</p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 md:flex">
            <button className="flex h-9 items-center gap-2 rounded-md bg-[#0a0a0e] px-3 text-sm font-semibold text-white shadow-sm">
              <Activity className="h-4 w-4" />
              Overview
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search scans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-48 lg:w-64 rounded-lg border border-white/10 bg-[#0a0a0e]/50 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0e]/95 backdrop-blur-xl shadow-xl max-h-64 overflow-y-auto"
                  >
                    {filteredScans.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-400">No results found</div>
                    ) : (
                      filteredScans.map((scan) => {
                        const canOpen = scan.status === 'COMPLETED' && scan.finalReportJson;
                        return (
                          <button
                            key={scan.id}
                            disabled={!canOpen}
                            onClick={() => {
                              if (canOpen && scan.finalReportJson) {
                                setReport(scan.finalReportJson);
                                setPackageName(scan.filename);
                                setSearchQuery('');
                              }
                            }}
                            className={cn(
                              "w-full px-4 py-3 text-left transition hover:bg-white/5 border-b border-white/5 last:border-0",
                              !canOpen && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <p className="truncate text-sm font-semibold text-white">{scan.filename}</p>
                            <div className="mt-1 flex items-center justify-between text-xs">
                              <span className={cn("font-medium", scan.status === 'COMPLETED' ? "text-emerald-400" : "text-slate-400")}>
                                {scan.status === 'COMPLETED' ? 'Complete' : 'Pending'}
                              </span>
                              {scan.status === 'COMPLETED' && (
                                <span className="font-mono text-slate-400">Risk: {scan.finalReportJson?.risk_score || 0}</span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold uppercase text-white shadow-sm"
                title="Account"
              >
                {user?.name?.substring(0, 1) || user?.email?.substring(0, 1) || 'A'}
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0e] shadow-xl"
                  >
                    <div className="border-b border-white/5 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-white">{user?.name || 'Analyst'}</p>
                      <p className="truncate text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-amber-700">Analyst dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0] || 'Analyst'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Monitor APK scans, review risk posture, and connect alert delivery from one focused workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="flex h-10 items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Upload APK
            </button>
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex h-10 items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 text-sm font-semibold text-cyan-400 shadow-sm transition hover:bg-cyan-500/20"
            >
              <MessageSquareText className="h-4 w-4" />
              Connect alerts
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total scans" value={recentScans.length} trend="14d" trendTone="emerald" icon={FileSearch} data={scanSeries} />
          <MetricCard title="High risk found" value={highRiskCount} trend={`${highRiskPercent}%`} trendTone="rose" icon={AlertTriangle} data={highRiskSeries} />
          <MetricCard title="Success rate" value={`${successRate}%`} trend={`${completedCount}/${recentScans.length || 0}`} trendTone="emerald" icon={ShieldCheck} data={successSeries} />
          <MetricCard title="Avg analysis time" value={avgDuration} trend="live" trendTone="amber" icon={Clock3} data={activeSeries} />
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={cn(cardClass, 'p-5 xl:col-span-4')}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Upload APK pipeline</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">Upload an APK and follow the scan lifecycle.</p>
              </div>
              <span className="rounded-lg border border-white/10 bg-[#0a0a0e]/5 p-2 text-slate-400">
                <Radar className="h-5 w-5" />
              </span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#0a0a0e]/20 border border-white/5">
              <div
                className="h-full rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-700"
                style={{ width: uploadStatus === 'success' ? '100%' : uploadStatus === 'analyzing' ? '66%' : uploadStatus === 'uploading' ? '32%' : '0%' }}
              />
            </div>
            <div className="space-y-4">
              <PipelineStep label="Upload target APK" complete={uploadStatus === 'analyzing' || uploadStatus === 'success'} active={uploadStatus === 'uploading'} />
              <PipelineStep label="Static code analysis" complete={uploadStatus === 'success'} active={uploadStatus === 'analyzing'} />
              <PipelineStep label="Manifest and permission mapping" complete={uploadStatus === 'success'} active={uploadStatus === 'analyzing'} />
              <PipelineStep label="Generate intelligence report" complete={uploadStatus === 'success'} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={cn(cardClass, 'p-5 xl:col-span-4')}>
            <RiskGauge score={avgScore} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={cn(cardClass, 'p-5 xl:col-span-4')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Threat mix</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">Projected distribution across recent activity.</p>
              </div>
              <span className="rounded-lg border border-white/10 bg-[#0a0a0e]/5 p-2 text-slate-400">
                <BarChart3 className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-8 flex h-8 overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0e]/20">
              <div className="bg-emerald-500" style={{ width: `${lowRiskPercent}%` }} />
              <div className="bg-yellow-500" style={{ width: `${mediumRiskPercent}%` }} />
              <div className="bg-red-500" style={{ width: `${highRiskPercent}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-400">
                <p className="font-semibold">{lowRiskPercent}%</p>
                <p className="text-xs font-medium">Low</p>
              </div>
              <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-yellow-400">
                <p className="font-semibold">{mediumRiskPercent}%</p>
                <p className="text-xs font-medium">Medium</p>
              </div>
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-400">
                <p className="font-semibold">{highRiskPercent}%</p>
                <p className="text-xs font-medium">Critical</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-lg border border-white/10 bg-[#0a0a0e]/5 px-3 py-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <ShieldEllipsis className="h-4 w-4 text-slate-400" />
                Reports ready
              </span>
              <span className="text-sm font-semibold text-white">{completedCount}</span>
            </div>
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={cn(cardClass, 'mt-4 overflow-hidden')}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-white">Live analysis stream</h2>
              <p className="mt-1 text-sm text-slate-400">Recent APK submissions and generated reports.</p>
            </div>
            <span className="rounded-md border border-white/10 bg-[#0a0a0e]/5 px-2.5 py-1.5 text-xs font-semibold text-slate-400">Last 50</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-[#0a0a0e]/40 text-xs font-semibold uppercase tracking-widest text-emerald-500/70 border-b border-white/5">
                <tr>
                  <th className="px-5 py-3">Target</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Risk score</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentScans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-[#0a0a0e]/5 text-slate-400">
                          <FileSearch className="h-6 w-6" />
                        </span>
                        <p className="text-sm font-semibold text-slate-200">No recent scans found</p>
                        <p className="mt-1 text-sm text-slate-400">Start a new analysis to populate this stream.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentScans.map((scan) => {
                    const score = scan.finalReportJson?.risk_score || 0;
                    const canOpen = scan.status === 'COMPLETED' && scan.finalReportJson;
                    return (
                      <tr
                        key={scan.id}
                        onClick={() => {
                          if (canOpen && scan.finalReportJson) {
                            setReport(scan.finalReportJson);
                            setPackageName(scan.filename);
                          }
                        }}
                        className={cn('transition-all duration-200 hover:bg-white/5 hover:shadow-sm', canOpen && 'cursor-pointer')}
                      >
                        <td className="px-5 py-4">
                          <p className="max-w-[280px] truncate text-sm font-semibold text-white">{scan.filename}</p>
                          <p className="mt-1 text-xs text-slate-400">APK package</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">{new Date(scan.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'rounded-md px-2 py-1 text-xs font-mono font-semibold border',
                              score >= 70 && 'bg-red-500/10 border-red-500/20 text-red-400',
                              score >= 35 && score < 70 && 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
                              score < 35 && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                            )}
                          >
                            {scan.status === 'COMPLETED' ? score : 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={scan.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button disabled={!canOpen} className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-slate-300 transition hover:bg-[#0a0a0e]/10 disabled:cursor-not-allowed disabled:text-slate-300">
                            Open
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>

      <WhatsAppConnectModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
}

export default DashboardView;
