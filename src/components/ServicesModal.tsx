'use client';

import React from 'react';
import { X, Wrench, Phone, MapPin, Mail, ShieldCheck, Check, Clock, Laptop, Cpu, HardDrive } from 'lucide-react';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0e4da4] text-white p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <Wrench className="w-6 h-6 text-yellow-300" />
              <h2 className="text-xl font-bold">IT Remont & Teenused Tallinnas</h2>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Professionaalne arvutiabi, riistvara remont ja tehniku vÃ¤ljakutsed
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-1.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          {/* Top Banner Contacts */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="space-y-1">
              <div className="font-bold text-sm text-[#0e4da4]">Canman OÃœ ArvutitÃ¶Ã¶koda</div>
              <p className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0e4da4]" />
                Lille 14-4 Tallinn 10614 Harjumaa
              </p>
              <p className="text-slate-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0e4da4]" />
                Avatud: E-R 10:00 - 18:00
              </p>
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-auto">
              <a
                href="tel:+3725652062"
                className="bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold px-4 py-2 rounded-lg text-xs transition text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Helista: +372 5652062</span>
              </a>
              <a
                href="mailto:canman.systems@gmail.com"
                className="bg-white border border-blue-300 text-[#0e4da4] hover:bg-blue-100 font-semibold px-4 py-1.5 rounded-lg text-xs transition text-center flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>canman.systems@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Services Price Table Grid */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 border-b border-slate-200 pb-1">
              RemonditÃ¶Ã¶de ja IT-Abi Hinnakiri (Tallinn)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm flex justify-between">
                  <span>Arvuti diagnostika</span>
                  <span className="text-[#0e4da4]">15 â‚¬</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Rikke tuvastamine ja remondihinna kalkulatsioon. Remondi korral diagnostika tasuta!
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm flex justify-between">
                  <span>Windows / Linux Paigaldus</span>
                  <span className="text-[#0e4da4]">25 â‚¬ - 35 â‚¬</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  OperatsioonisÃ¼steemi paigaldus koos kÃµigi vajalike drosselite, viirusetÃµrje ja draiveritega.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm flex justify-between">
                  <span>SSD & RAM Uuendamine</span>
                  <span className="text-[#0e4da4]">20 â‚¬</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Vana arvuti kiiruse tÃµstmine SSD kettaga ja mÃ¤lumahulise lahendusega. Andmete kloonimine.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm flex justify-between">
                  <span>Tehniku VÃ¤ljakutse Tallinnas</span>
                  <span className="text-[#0e4da4]">35 â‚¬ / tund</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  IT-spetsialisti vÃ¤ljasÃµit koju vÃµi kontorisse Tallinnas ja Harjumaal. VÃµrgu ja printerite seadistus.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm flex justify-between">
                  <span>Tolmust puhastus & Termopasta</span>
                  <span className="text-[#0e4da4]">25 â‚¬ - 40 â‚¬</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  SÃ¼learvutite ja lauaarvutite jahutussÃ¼steemi hooldus, mÃ¼ra vÃ¤hendamine ja Ã¼lekuumenemise vÃ¤ltimine.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm flex justify-between">
                  <span>Andmete Taastamine (Data Recovery)</span>
                  <span className="text-[#0e4da4]">alates 30 â‚¬</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Kustutatud vÃµi kahjustatud kÃµvakettalt, mÃ¤lukaardilt ja USB pulgalt failide taastamine.
                </p>
              </div>
            </div>
          </div>

          {/* Guarantees list */}
          <div className="bg-[#0e4da4]/5 border border-[#0e4da4]/20 rounded-xl p-4 space-y-2">
            <div className="font-bold text-[#0e4da4] text-sm">Miks valida Canman IT-remont?</div>
            <ul className="space-y-1 text-slate-700">
              <li className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pikaajaline kogemus arvutite remondis ja hoolduses Tallinnas.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Kiire teostus â€” enamik remonte valmib 24-48 tunni jooksul.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>KÃµikidele tehtud tÃ¶Ã¶dele ja vahetatud varuosadele garantii.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

