'use client';

import React from 'react';
import {
  Wrench,
  Bot,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Server,
  Cpu,
  Laptop
} from 'lucide-react';

interface FooterProps {
  onOpenServicesModal?: () => void;
  onServicesOpen?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenServicesModal, onServicesOpen }) => {
  const handleServices = onServicesOpen || onOpenServicesModal;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative overflow-hidden mt-16">
      {/* Subtle tech background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-wider canman-logo-shift">CANMAN</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                IT & AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professionaalsed IT-teenused, arvutite ja sülearvutite remont ning äriklientide IT-haldus Tallinnas ja Harjumaal. Usaldusväärne riistvara diagnostika ja kontrollitud garantiiga tehnika.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-200">Canman Systems OÜ</strong></div>
              <div>Reg. nr: 12147369</div>
              <div>KMKR: EE101478366</div>
              <div>Pank: LHV EE517700771001586069</div>
            </div>
          </div>

          {/* Col 2: IT Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>IT-Teenused</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  Arvutite ja sülearvutite kiirremont
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('arikliendile')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  Äriklindi IT-haldus ja lepinguline tugi
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  Tehniku väljakutsed Tallinnas & Harjumaal
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  Andmete taastamine ja varunduslahendused
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  Tolmust puhastus ja termopasta vahetus
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  AI ja töövoogude moderniseerimine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Kiirviited</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollTo('pood')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  E-Pood (Lauaarvutid, Sülearvutid)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('pood')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  Arvutikomponendid ja varuosad
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('hinnakiri')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  Teenuste ja remondi hinnakiri
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('meist')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  Ettevõttest ja garantiitingimused
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('kontakt')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  Asukoht ja kontaktandmed
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Workshop Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Töökoda & Kontakt</span>
            </h4>
            <div className="text-xs text-slate-400 space-y-2.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200 block">Lille 14-4, Tallinn 10614</strong>
                  Tasuta parkimine maja ees
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Avatud: E–R 10:00 – 18:00</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:+3725652062" className="text-white font-semibold hover:text-cyan-400 transition">
                  +372 5652 062
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:canman.systems@gmail.com" className="hover:text-cyan-400 transition">
                  canman.systems@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Canman Systems OÜ. Kõik õigused kaitstud. canman.eu</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tallinn, Harjumaa</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Garanteeritud kvaliteet
            </span>
          </div>
          <div>
            <h3 className="text-white font-bold">Kontakt</h3>
            <a href="tel:+3725652062" className="mt-2 inline-block text-sm hover:text-white transition-colors">
              +372 5652062
            </a>
          </div>
          <div>
            {handleServices && (
              <button onClick={handleServices} className="text-sm hover:text-white transition-colors">
                Arvutiremont ja IT-abi
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
