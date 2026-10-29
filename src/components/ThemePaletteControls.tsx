'use client';

import { useState } from 'react';
import { Palette, RotateCcw, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useThemePalette } from '../context/ThemePaletteContext';

const PRESETS = [
  { header: '#17283f', helpPanel: '#1e324a' },
  { header: '#24364b', helpPanel: '#31465d' },
  { header: '#263238', helpPanel: '#37474f' },
  { header: '#243047', helpPanel: '#354766' },
];

export function ThemePaletteControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, t } = useLanguage();
  const { palette, setHeaderColor, setHelpPanelColor, resetPalette } = useThemePalette();

  return (
    <div className="fixed right-0 top-1/2 z-[70] -translate-y-1/2">
      {isOpen ? (
        <section
          aria-label={t('palette_title')}
          className="mr-3 w-72 rounded-2xl border border-slate-600 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold">{t('palette_title')}</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label={t('palette_close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between gap-3 text-xs text-slate-200">
              <span>{t('palette_header')}</span>
              <input
                type="color"
                value={palette.header}
                onChange={(event) => setHeaderColor(event.target.value)}
                aria-label={t('palette_header')}
                className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-xs text-slate-200">
              <span>{t('palette_help_panel')}</span>
              <input
                type="color"
                value={palette.helpPanel}
                onChange={(event) => setHelpPanelColor(event.target.value)}
                aria-label={t('palette_help_panel')}
                className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>

            <div>
              <p className="mb-2 text-[11px] font-medium text-slate-400">{t('palette_presets')}</p>
              <div className="flex gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={`${preset.header}-${preset.helpPanel}`}
                    type="button"
                    onClick={() => {
                      setHeaderColor(preset.header);
                      setHelpPanelColor(preset.helpPanel);
                    }}
                    className="h-8 flex-1 rounded-lg border border-white/20 transition hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${preset.header} 50%, ${preset.helpPanel} 50%)`,
                    }}
                    aria-label={`${t('palette_preset')} ${preset.header}`}
                    title={`${preset.header} / ${preset.helpPanel}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={resetPalette}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t('palette_reset')}
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-11 items-center justify-center rounded-l-xl border border-r-0 border-slate-600 bg-slate-950/90 text-sky-300 shadow-xl backdrop-blur transition hover:bg-slate-800"
          aria-label={t('palette_title')}
          title={lang === 'en' ? 'Adjust test colors' : 'Muuda testvärve'}
        >
          <Palette className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
