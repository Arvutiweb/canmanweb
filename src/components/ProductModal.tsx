'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, ShieldCheck, MapPin, Truck, Plus, Minus, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }: any) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [loadingImg, setLoadingImg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const allImgs: any[] = product.images || product.Images || product.rawImages || [];
  const norm = (s: any) => {
    const t = String(s || '');
    if (!t) return '';
    if (t === '/images/placeholder.webp' || t === 'placeholder.webp') return '/images/placeholder.png';
    return t.startsWith('/') || t.startsWith('http') ? t : `/images/${t}`;
  };
  let imgs = allImgs.map(norm).filter(Boolean);
  if (!imgs.length) {
    const single = product.image || product.imageUrl;
    if (single) imgs = [norm(single)];
  }
  if (!imgs.length) imgs = ['/images/placeholder.png'];
  const fullSrc = imgs[activeImg] || imgs[0];

  const title = product.title || product.name || product.sku || '';
  const rawPrice = product.finalPrice || product.salePrice || product.price || 0;
  const priceNum = parseFloat(String(rawPrice).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
  const oldPriceNum = product.oldPrice ? parseFloat(String(product.oldPrice).replace(/[^0-9.,]/g, '').replace(',', '.')) : 0;
  const shortSpec = product.shortSpec || product.shortDescription || '';
  const description = product.description || '';
  const specs = product.specs || product.attributes || {};
  const hasSpecs = specs && Object.keys(specs).length > 0;

  const handleAddToCart = () => {
    addToCart({ ...product, id: product.id || product.sku, title, price: priceNum, imageUrl: imgs[0] }, quantity);
    onClose();
  };

  const handleImageLoad = (src: string) => {
    setLoadingImg(prev => (prev === src ? null : prev));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={(e) => {
        // Clicking on the modal backdrop closes the window and returns to grid
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-6 transition-all duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Return / Close Navigation Bar */}
        <div
          onClick={onClose}
          className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-100 hover:bg-slate-200/80 border-b border-slate-200 cursor-pointer transition select-none group"
          title="Tagasi toodete ruudustikku (Kliki sulgemiseks)"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 group-hover:text-[#0e4da4] transition">
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 group-hover:text-[#0e4da4] transition-transform" />
            <span>Tagasi toodete nimekirja (grid)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Kliki siia või vajuta ESC</span>
            <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-500 group-hover:text-slate-900 shadow-sm">
              <X className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery Section */}
          <div className="bg-[#f8f9fb] p-4 md:p-6 flex flex-col">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer group"
              title="Kliki pildil sulgemiseks ja toodete ruudustikku naasmiseks"
              onClick={onClose}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                {loadingImg === fullSrc && (
                  <Loader2 className="w-8 h-8 text-[#0e4da4] animate-spin" />
                )}
                <div className="w-full h-full">
                  <Image
                    src={fullSrc}
                    alt={title}
                    fill
                    className={`object-contain p-4 md:p-6 transition-opacity duration-300 ${
                      loadingImg === fullSrc ? 'opacity-0' : 'opacity-100'
                    }`}
                    unoptimized
                    onLoad={() => handleImageLoad(fullSrc)}
                    priority={activeImg === 0}
                  />
                </div>
              </div>

              {/* Close hint - bottom right */}
              {imgs.length > 0 && (
                <div
                  className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 group-hover:text-[#0e4da4] rounded-full p-2 transition-colors shadow-sm"
                  aria-label="Sulge tootekaart"
                >
                  <X className="w-5 h-5" />
                </div>
              )}

              {/* Image counter - bottom center */}
              {imgs.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/70 text-white text-xs px-2.5 py-1 rounded-full">
                  {activeImg + 1} / {imgs.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {imgs.map((src: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 shrink-0 bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      activeImg === i
                        ? 'border-[#0e4da4] shadow-sm ring-2 ring-[#0e4da4]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    aria-label={`Pilt ${i + 1}`}
                    aria-current={activeImg === i ? 'true' : 'false'}
                  >
                    <div className="w-full h-full relative">
                      <Image
                        src={src}
                        alt={`${title} - vaade ${i + 1}`}
                        fill
                        className="object-cover p-1.5"
                        unoptimized
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category / Brand Breadcrumb */}
              <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2 font-medium">
                <span className="uppercase text-[#0e4da4] font-bold">{product.brand || 'Canman'}</span>
                {product.categoryL2 && (
                  <>
                    <span>•</span>
                    <span>{product.categoryL2}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2">
                {title}
              </h2>

              {/* Short Spec Tag */}
              {shortSpec && (
                <div className="inline-block bg-slate-100 text-slate-800 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-slate-200 mb-4">
                  {shortSpec}
                </div>
              )}

              {/* Price Block */}
              <div className="flex items-baseline space-x-3 mb-6">
                <div className="text-3xl font-black text-[#0e4da4]">
                  {priceNum.toFixed(2)} €
                </div>
                {oldPriceNum > priceNum && (
                  <div className="text-base text-slate-400 line-through">
                    {oldPriceNum.toFixed(2)} €
                  </div>
                )}
                <span className="text-xs text-slate-500 font-medium">sis. KM</span>
              </div>

              {/* Stock and Condition Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{product.stock || 'Laos (Lille 14 töökoda)'}</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Tasuta järeletulek või 1-2p pakiautomaat</span>
                </span>
              </div>

              {/* Description */}
              {description && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Kirjeldus</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                    {description}
                  </p>
                </div>
              )}

              {/* Specs Table */}
              {hasSpecs && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Tehnilised andmed</h4>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 text-xs space-y-2 max-h-40 overflow-y-auto">
                    {Object.entries(specs).map(([key, val]: any) => (
                      <div key={key} className="flex justify-between border-b border-slate-100 last:border-0 pb-1.5 last:pb-0">
                        <span className="text-slate-500 font-medium">{key}:</span>
                        <span className="text-slate-900 font-semibold text-right ml-2">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Return Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden self-start sm:self-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Vähenda kogust"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-5 py-2.5 text-base font-bold text-slate-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Suurenda kogust"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold py-3 px-6 rounded-lg text-sm sm:text-base flex items-center justify-center space-x-2 transition-colors shadow-sm hover:shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Lisa korvi {(priceNum * quantity).toFixed(2)} €</span>
              </button>

              {/* Close / Return to grid button */}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sulge</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
