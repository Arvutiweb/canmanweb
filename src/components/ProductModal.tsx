'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, ShieldCheck, MapPin, Truck, Plus, Minus, Loader2, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }: any) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [prevImg, setPrevImg] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenAnimating, setIsFullscreenAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loadingImg, setLoadingImg] = useState<string | null>(null);
  
  if (!product) return null;

  const allImgs: any[] = product.images || product.Images || product.rawImages || [];
  const norm = (s:any)=>{ const t=String(s||''); if (!t) return ''; if (t === '/images/placeholder.webp' || t === 'placeholder.webp') return '/images/placeholder.png'; return t.startsWith('/')||t.startsWith('http') ? t : `/images/${t}`; };
  let imgs = allImgs.map(norm).filter(Boolean);
  if (!imgs.length) { const single = product.image || product.imageUrl; if (single) imgs = [norm(single)]; }
  if (!imgs.length) imgs = ['/images/placeholder.png'];
  const fullSrc = imgs[activeImg] || imgs[0];

  const title = product.title || product.name || product.sku || '';
  const rawPrice = product.finalPrice || product.salePrice || product.price || 0;
  const priceNum = parseFloat(String(rawPrice).replace(/[^0-9.,]/g,'').replace(',','.')) || 0;
  const oldPriceNum = product.oldPrice ? parseFloat(String(product.oldPrice).replace(/[^0-9.,]/g,'').replace(',','.')) : 0;
  const shortSpec = product.shortSpec || product.shortDescription || '';
  const description = product.description || '';
  const specs = product.specs || product.attributes || {};
  const hasSpecs = specs && Object.keys(specs).length > 0;

  const handleAddToCart = () => {
    addToCart({ ...product, id: product.id || product.sku, title, price: priceNum, imageUrl: imgs[0] }, quantity);
    onClose();
  };

  const handleImageLoad = (src: string) => {
    setLoadingImg(prev => prev === src ? null : prev);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className={`bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-8 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 m-0 max-w-full rounded-none' : ''}`}
        onClick={e=>e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-full p-2 transition-colors shadow-sm"
          aria-label="Sulge"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery Section */}
          <div className="bg-[#f8f9fb] p-4 md:p-6 flex flex-col">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                {loadingImg === fullSrc && (
                  <Loader2 className="w-8 h-8 text-[#0e4da4] animate-spin" />
                )}
                <Image
                  src={fullSrc}
                  alt={title}
                  fill
                  className={`object-contain p-4 md:p-6 transition-opacity duration-300 ${loadingImg === fullSrc ? 'opacity-0' : 'opacity-100'}`}
                  unoptimized
                  onLoad={() => handleImageLoad(fullSrc)}
                  priority={activeImg === 0}
                />
              </div>
              
              {/* Magnifying glass icon - bottom right */}
              {imgs.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); setIsFullscreenAnimating(true); }}
                  className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-full p-2 transition-colors shadow-sm"
                  aria-label="Suurenda pilti"
                >
                  <Search className="w-5 h-5" />
                </button>
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
                    onClick={() => { setPrevImg(activeImg); setActiveImg(i); }}
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

          {/* Product Info Section */}
          <div className="p-4 md:p-6 flex flex-col max-h-[80vh] overflow-y-auto">
            <div className="flex-1 pr-2 md:pr-0">
              {/* Brand / Category */}
              <div className="text-sm text-slate-500 font-medium mb-2">
                {product.brand && <span className="font-semibold text-slate-700">{product.brand}</span>}
                {(product.categoryL1 || product.topCategory) && (
                  <span className="mx-1 text-slate-400">/</span>
                )}
                {(product.categoryL1 || product.topCategory) && (
                  <span>{product.categoryL1 || product.topCategory}</span>
                )}
                {(product.categoryL2 || product.subCategory) && (
                  <>
                    <span className="mx-1 text-slate-400">/</span>
                    <span>{product.categoryL2 || product.subCategory}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-4">{title}</h2>

              {/* Short Spec */}
              {shortSpec && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5 text-sm text-slate-800 leading-relaxed">
                  {shortSpec}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-5">
                <span className="text-2xl md:text-3xl font-extrabold text-[#0e4da4]">{priceNum.toFixed(2)} €</span>
                {oldPriceNum > 0 && (
                  <span className="text-lg text-slate-400 line-through">{oldPriceNum.toFixed(2)} €</span>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="text-sm text-slate-700 leading-relaxed mb-5 whitespace-pre-line">{description}</p>
              )}

              {/* Specs Table */}
              {hasSpecs && (
                <div className="border border-slate-200 rounded-lg overflow-hidden mb-6 text-sm">
                  <div className="divide-y divide-slate-100">
                    {Object.entries(specs).map(([key, val]: any) => val ? (
                      <div key={key} className="grid grid-cols-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors">
                        <span className="text-slate-500 capitalize font-medium">{key}:</span>
                        <span className="col-span-2 text-slate-800">{String(val)}</span>
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}

              {/* Delivery / Warranty Info */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center text-slate-700 space-x-2">
                  <MapPin className="w-4 h-4 text-[#0e4da4] flex-shrink-0" />
                  <span>Kätte saamine: <strong className="text-slate-900">Lille 14-4 Tallinn</strong></span>
                </div>
                <div className="flex items-center text-slate-700 space-x-2">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Omniva & DPD (4.90 €)</span>
                </div>
                <div className="flex items-center text-slate-700 space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Garantii: <strong className="text-slate-900">{(specs as any).warranty || 'erinevalt'}</strong></span>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Vähenda kogust"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-5 py-2.5 text-base font-bold text-slate-900 min-w-[3rem] text-center">{quantity}</span>
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
                className="flex-1 bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold py-3 px-6 rounded-lg text-base flex items-center justify-center space-x-2 transition-colors shadow-sm hover:shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Lisa korvi {(priceNum * quantity).toFixed(2)} €</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Image Modal */}
        {(isFullscreen || isFullscreenAnimating) && (
          <div
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
            style={{ opacity: isFullscreenAnimating ? 1 : 0 }}
            onClick={() => {
              setIsFullscreenAnimating(false);
              setTimeout(() => setIsFullscreen(false), 300);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Pilt täisekraanis"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreenAnimating(false);
                setTimeout(() => setIsFullscreen(false), 300);
              }}
              className="absolute top-4 right-4 z-[70] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
              aria-label="Sulge täisekraan"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-[90vw] max-h-[90vh] transform transition-all duration-300"
              style={{
                opacity: isFullscreenAnimating ? 1 : 0,
                transform: isFullscreenAnimating
                  ? (isClosing ? 'scale(1.05)' : 'scale(1)')
                  : 'scale(0.95)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Zoom effect: expand then close
                if (!isClosing) {
                  setIsClosing(true);
                  // First expand (zoom in)
                  setTimeout(() => {
                    // Then fade out and close
                    setIsFullscreenAnimating(false);
                    setTimeout(() => {
                      setIsFullscreen(false);
                      setIsClosing(false);
                    }, 300);
                  }, 150);
                }
              }}>
              <Image
                src={fullSrc}
                alt={title}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
                unoptimized
                priority
              />
            </div>

            {/* Navigation in fullscreen */}
            {imgs.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === 0 ? imgs.length - 1 : prev - 1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[70] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                  aria-label="Eelmine pilt"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === imgs.length - 1 ? 0 : prev + 1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[70] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                  aria-label="Järgmine pilt"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                {/* Thumbnails in fullscreen - show previous image as well */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex max-w-[90vw] gap-2 overflow-x-auto">
                  {/* Previous image button */}
                  {prevImg !== null && (
                    <button
                      key="prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        const temp = activeImg;
                        setActiveImg(prevImg);
                        setPrevImg(temp);
                      }}
                      className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 border-amber-400/50 hover:border-amber-400 ring-2 ring-amber-400/30"
                      aria-label={`Eelmine pilt: ${prevImg + 1}`}
                      title="Eelmine vaadatud pilt"
                    >
                      <Image src={imgs[prevImg]} alt="" fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                    </button>
                  )}
                  {imgs.map((src: any, i: number) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setPrevImg(activeImg); setActiveImg(i); }}
                      className={`relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeImg === i
                          ? 'border-white ring-2 ring-white/30'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      aria-label={`Pilt ${i + 1}`}
                    >
                      <Image src={src} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};