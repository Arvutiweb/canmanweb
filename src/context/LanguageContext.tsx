'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'et' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  et: {
    // Header
    nav_services: 'IT-Teenused',
    nav_business: 'Ärikliendile',
    nav_shop: 'E-Pood',
    nav_pricing: 'Hinnakiri',
    nav_about: 'Meist',
    nav_contact: 'Kontakt',
    nav_cart: 'Korv',
    search_placeholder: 'Otsi tooteid...',
    tagline: 'IT-TEENUSED • REMONT • ARVUTID',
    phone_cta: '+372 5652 062',
    
    // Hero
    hero_badge: 'USALDUSVÄÄRNE IT-PARTNER TALLINNAS • AASTAST 2004',
    hero_title_1: 'Professionaalsed ',
    hero_title_highlight: 'IT-teenused',
    hero_title_2: ' ja arvutite kiirhooldus',
    hero_subtitle: 'Arvutipargi lepinguline haldus ettevõtetele, riistvara kiirdiagnostika ja remont Canman töökojas (Lille 14, Tallinn) ning kogenud IT-tehniku väljakutsed kontorisse või koju.',
    btn_services: 'Vaata IT-teenuseid',
    btn_business: 'IT-Haldus ärikliendile',
    btn_shop: 'E-Pood (Arvutid)',
    
    // Trust pills
    trust_diag: 'Diagnostika 24h',
    trust_warranty: 'Ametlik garantii',
    trust_location: 'Lille 14, Tallinn',
    trust_callout: 'Tehniku väljakutse',

    // Quick Help Box
    help_title: 'Vajad kohest IT-abi?',
    help_subtitle: 'Kiire lahendus era- ja äriklientidele',
    help_badge: 'VALMIS AITAMA',
    help_name_label: 'Sinu nimi või ettevõte',
    help_name_placeholder: 'Nt. Jaan Tamm või AS Firma',
    help_phone_label: 'Telefoninumber *',
    help_issue_label: 'Mis seadmega või murega on tegemist?',
    help_issue_placeholder: 'Nt. Sülearvuti ei käivitu, ekraan katki, võrk maas...',
    help_submit: 'Saada päring & Broneeri IT-tehnik',
    help_call_text: 'Või helista kohe:',

    // Sections
    sec_services_badge: 'PÕHITEENUSED',
    sec_services_title: 'Kõik IT-teenused ja arvutiremont ühest kohast',
    sec_pricing_badge: 'LÄBIPAISTEV HINNASTUS',
    sec_pricing_title: 'Standardtööde ja IT-Abi Hinnakiri',
    sec_shop_badge: 'CANMAN E-POOD',
    sec_shop_title: 'Kontrollitud arvutid, varuosad ja tehnika',
    sec_about_badge: 'ETTEVÕTTEST',
    sec_about_title: 'Canman Systems OÜ — 20+ aastat IT-kogemust Tallinnas',
    sec_contact_badge: 'VÕTA ÜHENDUST',
    sec_contact_title: 'Tule kohale või saada meile päring',
  },
  en: {
    // Header
    nav_services: 'IT Services',
    nav_business: 'For Business',
    nav_shop: 'Shop',
    nav_pricing: 'Price List',
    nav_about: 'About Us',
    nav_contact: 'Contact',
    nav_cart: 'Cart',
    search_placeholder: 'Search products...',
    tagline: 'IT SERVICES • REPAIR • COMPUTERS',
    phone_cta: '+372 5652 062',

    // Hero
    hero_badge: 'TRUSTED IT PARTNER IN TALLINN • SINCE 2004',
    hero_title_1: 'Professional ',
    hero_title_highlight: 'IT Services',
    hero_title_2: ' & Computer Maintenance',
    hero_subtitle: 'Contracted IT management for companies, fast hardware diagnostics & repair in Canman workshop (Lille 14, Tallinn), and on-site technician callouts to your office or home.',
    btn_services: 'View IT Services',
    btn_business: 'Business IT Support',
    btn_shop: 'Shop (Computers)',

    // Trust pills
    trust_diag: 'Diagnostics 24h',
    trust_warranty: 'Official Warranty',
    trust_location: 'Lille 14, Tallinn',
    trust_callout: 'On-site Technician',

    // Quick Help Box
    help_title: 'Need Immediate IT Help?',
    help_subtitle: 'Fast solution for private & business clients',
    help_badge: 'READY TO HELP',
    help_name_label: 'Your name or company',
    help_name_placeholder: 'E.g. John Doe or Company Ltd',
    help_phone_label: 'Phone number *',
    help_issue_label: 'What device or problem are you experiencing?',
    help_issue_placeholder: 'E.g. Laptop will not boot, broken screen, network down...',
    help_submit: 'Submit Request & Book Technician',
    help_call_text: 'Or call directly:',

    // Sections
    sec_services_badge: 'CORE SERVICES',
    sec_services_title: 'All IT Services & Computer Repairs in One Place',
    sec_pricing_badge: 'TRANSPARENT PRICING',
    sec_pricing_title: 'Standard Service & IT Support Price List',
    sec_shop_badge: 'CANMAN SHOP',
    sec_shop_title: 'Tested Computers, Components & Hardware',
    sec_about_badge: 'ABOUT US',
    sec_about_title: 'Canman Systems OÜ — 20+ Years of IT Expertise in Tallinn',
    sec_contact_badge: 'GET IN TOUCH',
    sec_contact_title: 'Visit Our Workshop or Send an Inquiry',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'et',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('et');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('canman_lang') as Language;
      if (saved === 'et' || saved === 'en') {
        setLangState(saved);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('canman_lang', newLang);
    } catch {
      // Ignore
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.et[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
