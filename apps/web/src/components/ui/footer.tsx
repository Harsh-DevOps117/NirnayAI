
import { ShieldCheck, Globe, Mail, MessageSquare, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#050505] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0a0a0e] border border-white/10 group-hover:border-emerald-500/50 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="font-mono text-lg font-bold tracking-tight text-white group-hover:text-emerald-50 transition-colors">
                Nirnay<span className="text-emerald-500">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Autonomous mobile threat hunting pipeline. Decompile, analyze, and mitigate zero-days in seconds.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> Dashboard</Link></li>
              <li><Link to="/threat-grid" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Threat Grid</Link></li>
              <li><Link to="/api" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Pipeline APIs</Link></li>
              <li><Link to="/alerts" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">WhatsApp Alerts</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/docs" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Documentation</Link></li>
              <li><Link to="/api-reference" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">API Reference</Link></li>
              <li><Link to="/blog" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Security Blog</Link></li>
              <li><Link to="/reports" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Threat Reports</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclosure" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Responsible Disclosure</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} NirnayAI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500/70 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
};
