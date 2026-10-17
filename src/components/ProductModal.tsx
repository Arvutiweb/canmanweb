'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, ShieldCheck, MapPin, Truck, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const imgSrc = (product as any).imageUrl || (product as any).image || (product as any).images?.[0] || '/images/placeholder.webp'
  const fullSrc = imgSrc.startsWith('/') ? imgSrc : `/images/${imgSrc}`

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full p-2 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative bg-slate-50 p-6 flex items-center justify-center min-h-">
            <div className="relative w-full h-64 md:h-80">
              <Image src={fullSrc} alt={product.title} fill className="object-contain" unoptimized />
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between max-h- overflow-y-auto">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">
                {product.brand} / {product.categoryL1} / {product.categoryL2}
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug mb-3">
                {product.title}
              </h2>

              {/* Andmed ilma pealkirjata - puhas tekst */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text- text-slate-800 leading-relaxed">
                {product.shortSpec}
              </div>

              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-2xl font-extrabold text-[#0e4da4]">
                  {product.price.toFixed(2)} €
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {product.oldPrice.toFixed(2)} €
                  </span>
                )}
                {/* <p className="text- text-slate-500">sis. 22% KM</p> */}
              </div>

              <p className="text- text-slate-700 leading-relaxed mb-4 whitespace-pre-line">
                {product.description}
              </p>

              {/* Specs ilma pealkirjata */}
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-6 text-">
                <div className="divide-y divide-slate-100">
                  {Object.entries(product.specs).map(([key, val]) => (
                    val ? (
                      <div key={key} className="grid grid-cols-3 px-3 py-2">
                        <span className="text-slate-500 capitalize">{key}:</span>
                        <span className="col-span-2 text-slate-800 font-medium">{String(val)}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>

              <div className="space-y-2 text- mb-6">
                <div className="flex items-center text-slate-700 space-x-2">
                  <MapPin className="w-4 h-4 text-[#0e4da4] flex-shrink-0" />
                  <span>Kätte saamine poest: <strong>Lille 14-4 Tallinn 10614 Harjumaa</strong> (Kohapeal laos)</span>
                </div>
                <div className="flex items-center text-slate-700 space-x-2">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Kuller / Pakiautomaat: <strong>Omniva & DPD (4.90 €)</strong> 1-2 tööpäeva</span>
                </div>
                <div className="flex items-center text-slate-700 space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Garantii: <strong>{(product.specs as any).warranty || (product.condition === 'Uus' ? '24 kuud' : '12 kuud')}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center space-x-3">
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 text-xs font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow flex items-center justify-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Lisa ostukorvi ({(product.price * quantity).toFixed(2)} €)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
