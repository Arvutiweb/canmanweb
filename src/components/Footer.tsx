'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import {
  Wrench,
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
  const { lang } = useLanguage();
  const local = (et: string, en: string) => lang === 'en' ? en : et;

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
              <Image
                src="/images/canman-systems-it-services-v4.webp"
                alt="Canman Systems – IT services"
                width={500}
                height={304}
                className="h-auto w-32"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {local('Professionaalsed IT-teenused, arvutite ja sülearvutite remont ning äriklientide IT-haldus Tallinnas ja Harjumaal. Usaldusväärne riistvara diagnostika ja kontrollitud garantiiga tehnika.', 'Professional IT services, computer and laptop repairs, and business IT support in Tallinn and Harju County. Reliable hardware diagnostics and quality-checked equipment with a warranty.')}
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-200">Canman Systems OÜ</strong></div>
              <div>{local('Reg. nr:', 'Registration no:')} 12147369</div>
              <div>{local('KMKR:', 'VAT:')} EE101478366</div>
              <div>{local('Pank:', 'Bank:')} LHV EE517700771001586069</div>
            </div>
          </div>

          {/* Col 2: IT Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>{local('IT-Teenused', 'IT Services')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  {local('Arvutite ja sülearvutite kiirremont', 'Computer and laptop repairs')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('arikliendile')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  {local('Ärikliendi IT-haldus ja lepinguline tugi', 'Managed IT support for businesses')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  {local('Tehniku väljakutsed Tallinnas & Harjumaal', 'On-site technicians in Tallinn & Harju County')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  {local('Andmete taastamine ja varunduslahendused', 'Data recovery and backup solutions')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  {local('Tolmust puhastus ja termopasta vahetus', 'Dust cleaning and thermal paste replacement')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('teenused')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500" />
                  {local('AI ja töövoogude moderniseerimine', 'AI and workflow modernization')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{local('Kiirviited', 'Quick Links')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollTo('pood')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  {local('E-Pood (Lauaarvutid, Sülearvutid)', 'Shop (Desktops, Laptops)')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('pood')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  {local('Arvutikomponendid ja varuosad', 'Computer components and parts')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('hinnakiri')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  {local('Teenuste ja remondi hinnakiri', 'Service and repair price list')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('meist')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  {local('Ettevõttest ja garantiitingimused', 'About us and warranty terms')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('kontakt')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  {local('Asukoht ja kontaktandmed', 'Location and contact details')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Workshop Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{local('Töökoda & Kontakt', 'Workshop & Contact')}</span>
            </h4>
            <div className="text-xs text-slate-400 space-y-2.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200 block">Lille 14-4, Tallinn 10614</strong>
                  {local('Tasuta parkimine maja ees', 'Free parking outside')}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{local('Avatud: E–R 10:00 – 18:00', 'Open: Mon–Fri 10:00 – 18:00')}</span>
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
          <p>© {new Date().getFullYear()} Canman Systems OÜ. {local('Kõik õigused kaitstud.', 'All rights reserved.')} canman.eu</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tallinn, Harjumaa</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              {local('Garanteeritud kvaliteet', 'Guaranteed quality')}
            </span>
          </div>
          <div>
            <h3 className="text-white font-bold">{local('Kontakt', 'Contact')}</h3>
            <a href="tel:+3725652062" className="mt-2 inline-block text-sm hover:text-white transition-colors">
              +372 5652062
            </a>
          </div>
          <div>
            {handleServices && (
              <button onClick={handleServices} className="text-sm hover:text-white transition-colors">
                {local('Arvutiremont ja IT-abi', 'Computer Repair & IT Support')}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
