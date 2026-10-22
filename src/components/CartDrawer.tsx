'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 bg-[#0e4da4] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="font-bold text-base">Ostukorv ({cartCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-white hover:text-yellow-300 p-1 transition rounded-full"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 p-4 overflow-y-auto divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Sinu ostukorv on tühi
                </p>
                <p className="text-xs text-slate-400">
                  Lisa tooteid e-poe kataloogist.
                </p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex space-x-3 items-center">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.imageUrl || '/images/placeholder.png'}
                      alt={product.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {product.shortSpec}
                    </p>
                    <div className="text-xs font-extrabold text-[#0e4da4] mt-0.5">
                      €{product.price.toFixed(2)} / tk
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded bg-slate-50">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-500 hover:text-red-700 text-xs p-1 transition"
                        title="Eemalda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total item price */}
                  <div className="text-right text-xs font-bold text-slate-900">
                    €{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Vahesumma (Subtotal):</span>
                  <span className="font-semibold text-slate-800">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Käibemaks 24% (KM):</span>
                  <span>€{(subtotal * 0.24 / 1.24).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-200">
                  <span>Kokku (Total):</span>
                  <span className="text-[#0e4da4]">€{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow flex items-center justify-center space-x-2"
              >
                <span>Vormista tellimus (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
