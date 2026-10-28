'use client';

import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Condition } from '../types';

const safeLower = (value: unknown) => String(value || '').toLowerCase();

interface CategorySidebarProps {
  selectedL1: string | null;
  selectedL2: string | null;
  onSelectCategory: (level1: string | null, level2: string | null, level3: string | null) => void;
  products: any[];
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  processorFilter: string;
  setProcessorFilter: (value: string) => void;
  memoryFilter: string;
  setMemoryFilter: (value: string) => void;
  diskFilter: string;
  setDiskFilter: (value: string) => void;
  operatingSystemFilter: string;
  setOperatingSystemFilter: (value: string) => void;
  conditionFilter: Condition | 'all';
  setConditionFilter: (value: Condition | 'all') => void;
}

export function CategorySidebar({
  selectedL1,
  selectedL2,
  onSelectCategory,
  products,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  processorFilter,
  setProcessorFilter,
  memoryFilter,
  setMemoryFilter,
  diskFilter,
  setDiskFilter,
  operatingSystemFilter,
  setOperatingSystemFilter,
  conditionFilter,
  setConditionFilter,
}: CategorySidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const { t, lang } = useLanguage();

  const grouped = useMemo(() => {
    const map = new Map<string, { count: number; subs: Map<string, { count: number }> }>();
    (products || []).forEach((product) => {
      const rawL1 = String(product.categoryL1 || product.topCategory || product.category || 'Muu').trim();
      const rawL2 = String(product.categoryL2 || product.subCategory || '').trim();
      let baseL1 = rawL1;
      let generation: string | null = null;
      if (rawL1.toLowerCase().includes('desktop kasutatud')) {
        baseL1 = 'Desktop kasutatud / used';
        if (rawL1.includes(',')) generation = rawL1.split(',')[1]?.trim() || null;
        if (!generation && rawL2 && /\d+-gen/i.test(rawL2)) generation = rawL2;
      }

      if (!map.has(baseL1)) map.set(baseL1, { count: 0, subs: new Map() });
      const category = map.get(baseL1)!;
      category.count++;
      const subcategory = generation || rawL2;
      if (!subcategory) return;
      if (!category.subs.has(subcategory)) category.subs.set(subcategory, { count: 0 });
      category.subs.get(subcategory)!.count++;
    });
    return map;
  }, [products]);

  const filterOptions = useMemo(() => {
    const valuesFor = (key: string) => Array.from(new Set(
      (products || [])
        .map((product) => String(product.specs?.[key] || product[key] || '').trim())
        .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b));

    return {
      processors: valuesFor('cpu'),
      memories: valuesFor('ram'),
      disks: valuesFor('storage'),
      operatingSystems: valuesFor('os'),
      conditions: Array.from(new Set((products || []).map((product) => String(product.condition || '').trim()).filter(Boolean))).sort(),
    };
  }, [products]);

  const renderSelect = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: string[],
  ) => (
    <label className="block text-xs font-medium text-slate-600">
      <span className="mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0e4da4] focus:ring-2 focus:ring-blue-100"
      >
        <option value="">{t('filter_all')}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'Kasutatud' && lang === 'en' ? 'Used' : option === 'Uus' && lang === 'en' ? 'New' : option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold tracking-widest text-slate-800 uppercase">{lang === 'en' ? 'Categories' : 'Kategooriad'}</h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(null, null, null)}
            className={`flex w-full justify-between rounded-xl px-3 py-2.5 text-left text-sm ${!selectedL1 ? 'bg-[#0e4da4] text-white' : 'hover:bg-slate-50'}`}
          >
            <span>{lang === 'en' ? 'All categories' : 'Kõik kategooriad'}</span>
            <span>{products?.length || 0}</span>
          </button>
          {Array.from(grouped.entries()).map(([base, data]) => {
            const isActive = safeLower(selectedL1) === safeLower(base);
            const isOpen = open[base] ?? isActive;
            return (
              <div key={base}>
                <button
                  onClick={() => {
                    setOpen((current) => ({ ...current, [base]: !current[base] }));
                    onSelectCategory(base, null, null);
                  }}
                  className={`flex w-full justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${isActive ? 'bg-blue-50 text-[#0e4da4]' : 'hover:bg-slate-50'}`}
                >
                  <span>› {base}</span>
                  <span className="rounded-full bg-slate-100 px-2 text-xs">{data.count}</span>
                </button>
                {isOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-3">
                    {Array.from(data.subs.entries()).map(([sub, subData]) => (
                      <button
                        key={sub}
                        onClick={() => onSelectCategory(base, sub, null)}
                        className={`flex w-full justify-between rounded-lg px-2 py-1.5 text-left text-sm ${safeLower(selectedL2) === safeLower(sub) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <span>{sub}</span>
                        <span>{subData.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold tracking-widest text-slate-800 uppercase">{t('filter_title')}</h3>
        <div className="space-y-4">
          <fieldset>
            <legend className="mb-1 text-xs font-medium text-slate-600">{t('filter_price')}</legend>
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="filter-min-price" className="text-[11px] text-slate-500">
                {t('filter_min_price')}
                <input
                  id="filter-min-price"
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(Number(event.target.value) || 0)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-[#0e4da4]"
                />
              </label>
              <label htmlFor="filter-max-price" className="text-[11px] text-slate-500">
                {t('filter_max_price')}
                <input
                  id="filter-max-price"
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value) || 0)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-[#0e4da4]"
                />
              </label>
            </div>
          </fieldset>
          {renderSelect(t('filter_processor'), processorFilter, setProcessorFilter, filterOptions.processors)}
          {renderSelect(t('filter_memory'), memoryFilter, setMemoryFilter, filterOptions.memories)}
          {renderSelect(t('filter_disk'), diskFilter, setDiskFilter, filterOptions.disks)}
          {renderSelect(t('filter_operating_system'), operatingSystemFilter, setOperatingSystemFilter, filterOptions.operatingSystems)}
          {renderSelect(
            t('filter_condition'),
            conditionFilter === 'all' ? '' : conditionFilter,
            (value) => setConditionFilter(value === 'Kasutatud' || value === 'Uus' ? value : 'all'),
            filterOptions.conditions,
          )}
        </div>
      </section>
    </div>
  );
}
