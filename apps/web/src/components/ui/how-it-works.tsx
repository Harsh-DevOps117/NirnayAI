
import { motion } from 'framer-motion';
import { UploadCloud, Cpu, ShieldAlert, FileCheck2 } from 'lucide-react';

const steps = [
  {
    icon: UploadCloud,
    title: '1. Secure Ingestion',
    description: 'Upload your Android APK through our encrypted tunnel. Our system instantly queues it for deep analysis.',
    glow: 'bg-emerald-500/20',
    border: 'group-hover:border-emerald-500/50',
    iconColor: 'group-hover:text-emerald-400'
  },
  {
    icon: Cpu,
    title: '2. Dynamic Dissection',
    description: 'The binary is unpacked. We perform static code analysis, manifest mapping, and sandbox execution.',
    glow: 'bg-cyan-500/20',
    border: 'group-hover:border-cyan-500/50',
    iconColor: 'group-hover:text-cyan-400'
  },
  {
    icon: ShieldAlert,
    title: '3. AI Threat Decoding',
    description: 'Our heuristic engine cross-references zero-days and identifies malicious intent using advanced ML models.',
    glow: 'bg-yellow-500/20',
    border: 'group-hover:border-yellow-500/50',
    iconColor: 'group-hover:text-yellow-400'
  },
  {
    icon: FileCheck2,
    title: '4. Actionable Intelligence',
    description: 'Receive a comprehensive risk report with precise mitigation steps, instantly pushed to your dashboard or via WhatsApp.',
    glow: 'bg-red-500/20',
    border: 'group-hover:border-red-500/50',
    iconColor: 'group-hover:text-red-400'
  }
];

export const HowItWorks = () => {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden border-t border-white/5 bg-[#0a0a0e]/40" id="how-it-works">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50 pointer-events-none -z-10"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-6"
          >
            <Cpu className="w-3.5 h-3.5" /> Pipeline Architecture
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-6"
          >
            Autonomous Threat Hunting
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            NirnayAI transforms raw Android binaries into actionable intelligence in seconds. Follow the lifecycle of a single APK scan.
          </motion.p>
        </div>

        <div className="relative">
          {/* Horizontal Line connecting nodes (desktop) */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-white/5 z-0">
             <motion.div 
               className="absolute top-0 left-0 bottom-0 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"
               initial={{ width: "0%" }}
               whileInView={{ width: "100%" }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 2.5, ease: "easeInOut" }}
             />
          </div>

          {/* Vertical Line connecting nodes (mobile) */}
          <div className="md:hidden absolute top-8 bottom-12 left-[31px] w-0.5 bg-white/5 z-0">
             <motion.div 
               className="absolute top-0 left-0 right-0 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"
               initial={{ height: "0%" }}
               whileInView={{ height: "100%" }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 2.5, ease: "easeInOut" }}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                className="relative flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-8 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.5 }}
              >
                {/* Icon Circle */}
                <div className="relative shrink-0">
                  {/* Outer Glow */}
                  <div className={`absolute inset-0 ${step.glow} rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Glass Card */}
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/10 bg-[#050505] flex items-center justify-center relative overflow-hidden ${step.border} transition-colors duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl`}>
                     <step.icon className={`w-7 h-7 md:w-10 md:h-10 text-slate-500 ${step.iconColor} transition-colors duration-500 relative z-10`} />
                     
                     {/* Radar sweep effect on hover */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                         className="w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                         style={{ background: `conic-gradient(from 0deg, transparent 70%, rgba(16,185,129,0.15) 100%)` }}
                       />
                     </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 md:text-center mt-1 md:mt-2">
                  <h4 className="text-xl font-semibold text-white mb-3 tracking-tight group-hover:text-emerald-50 transition-colors">{step.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
