import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ShieldCheck } from 'lucide-react';

const testimonials = [
  {
    quote: "NirnayAI caught a zero-day payload hidden in a seemingly benign PDF reader that three other enterprise scanners missed entirely.",
    author: "Alex Mercer",
    role: "Lead Security Researcher",
    company: "FinSecure",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    quote: "The heuristic ML models provide insane accuracy with minimal false positives. It's essentially an automated malware analyst running 24/7.",
    author: "Sarah Chen",
    role: "Chief Information Security Officer",
    company: "Nexus Banking",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704b"
  },
  {
    quote: "Having the dynamic analysis pipeline pipe threat intelligence directly to our WhatsApp group has fundamentally changed our incident response times.",
    author: "Marcus Rodriguez",
    role: "SecOps Engineer",
    company: "Defiance Networks",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704c"
  }
];

export const Testimonials = () => {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden border-t border-white/5 bg-[#050505]" id="testimonials">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Field Reports
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4"
          >
            Trusted by Red Teams
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            See what security professionals and malware analysts are saying about NirnayAI's threat detection capabilities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="rounded-2xl border border-white/10 bg-[#0a0a0e]/80 p-8 backdrop-blur-xl hover:border-emerald-500/30 transition-colors group relative overflow-hidden"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 group-hover:text-emerald-500/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-8 relative z-10 font-medium">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all" />
                <div>
                  <h4 className="text-white font-semibold text-sm">{testimonial.author}</h4>
                  <p className="text-emerald-500/80 text-xs font-mono">{testimonial.role}</p>
                  <p className="text-slate-500 text-xs">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
