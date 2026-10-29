'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemePalette {
  header: string;
  helpPanel: string;
}

interface ThemePaletteContextValue {
  palette: ThemePalette;
  setHeaderColor: (color: string) => void;
  setHelpPanelColor: (color: string) => void;
  resetPalette: () => void;
}

const STORAGE_KEY = 'canman_theme_palette';
const DEFAULT_PALETTE: ThemePalette = {
  header: '#17283f',
  helpPanel: '#1e324a',
};

const ThemePaletteContext = createContext<ThemePaletteContextValue | null>(null);

function isColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
}

export function ThemePaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState(DEFAULT_PALETTE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed: unknown = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') return;

      const storedPalette = parsed as Record<string, unknown>;
      setPalette({
        header: isColor(storedPalette.header) ? storedPalette.header : DEFAULT_PALETTE.header,
        helpPanel: isColor(storedPalette.helpPanel) ? storedPalette.helpPanel : DEFAULT_PALETTE.helpPanel,
      });
    } catch (error) {
      console.error('Unable to load saved theme colors.', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--canman-header-color', palette.header);
    document.documentElement.style.setProperty('--canman-help-panel-color', palette.helpPanel);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(palette));
    } catch (error) {
      console.error('Unable to save theme colors.', error);
    }
  }, [palette]);

  const value: ThemePaletteContextValue = {
    palette,
    setHeaderColor: (header) => setPalette((current) => ({ ...current, header })),
    setHelpPanelColor: (helpPanel) => setPalette((current) => ({ ...current, helpPanel })),
    resetPalette: () => setPalette(DEFAULT_PALETTE),
  };

  return <ThemePaletteContext.Provider value={value}>{children}</ThemePaletteContext.Provider>;
}

export function useThemePalette() {
  const context = useContext(ThemePaletteContext);
  if (!context) throw new Error('useThemePalette must be used within ThemePaletteProvider');
  return context;
}
