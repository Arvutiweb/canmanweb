'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COOKIE_NOTICE_STORAGE_KEY = 'canman_cookie_notice_dismissed';

export function CookieNotice() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) !== 'true');
    } catch {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, 'true');
    } catch {
      // The notice remains dismissed for the current page view.
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label={t('cookie_notice_title')}
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-700 bg-slate-950/95 text-white shadow-2xl backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-4 px-4 py-4 sm:items-center sm:px-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold">{t('cookie_notice_title')}</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{t('cookie_notice_body')}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span>{t('cookie_notice_dismiss')}</span>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
