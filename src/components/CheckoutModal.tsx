'use client';

import React, { useState } from 'react';
import { X, CreditCard, FileText, Truck, MapPin, CheckCircle2, ShieldCheck, User, Building, Mail, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PaymentMethod, DeliveryMethod, CustomerInfo, OrderDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { cart, subtotal, placeOrder } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('arve');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pakk');

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    companyName: '',
    regCode: '',
    vatNumber: '',
    email: '',
    phone: '',
    address: '',
    city: 'Tallinn',
    postalCode: '',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const deliveryFee = deliveryMethod === 'pakk' ? 4.90 : 0.0;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.email || !customer.phone) {
      setErrorMsg('Palun täida nõutud väljad (Nimi, E-post, Telefon).');
      return;
    }
    if (deliveryMethod === 'pakk' && (!customer.address || !customer.postalCode)) {
      setErrorMsg('Paki saatmiseks sisesta palun kohaletoimetamise aadress ja sihtnumber.');
      return;
    }

    setErrorMsg('');
    const newOrder = placeOrder(customer, paymentMethod, deliveryMethod);
    onOrderCompleted(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0e4da4] text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Tellimuse vormistamine (Checkout)</h2>
            <p className="text-xs text-blue-100">
              Arvutite ja lisaseadmete tellimus Canman e-poest
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-1.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#0e4da4]" />
              <span>1. Ostja andmed (Customer Info)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ees- ja perekonnanimi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nt. Peeter Tamm"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0e4da4] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  E-posti aadress *
                </label>
                <input
                  type="email"
                  required
                  placeholder="peeter@example.ee"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0e4da4] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Telefoninumber *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+372 55123456"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0e4da4] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ettevõtte nimi (Valikuline arve jaoks)
                </label>
                <input
                  type="text"
                  placeholder="OÜ Näidis Ettevõte"
                  value={customer.companyName}
                  onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0e4da4] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Options REQUIRED */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Truck className="w-4 h-4 text-[#0e4da4]" />
              <span>2. Tarneviis (Delivery Method)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Option A: Parcel */}
              <label
                className={`border rounded-xl p-3.5 cursor-pointer transition flex items-start space-x-3 ${
                  deliveryMethod === 'pakk'
                    ? 'border-[#0e4da4] bg-blue-50/60 ring-2 ring-[#0e4da4]/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="pakk"
                  checked={deliveryMethod === 'pakk'}
                  onChange={() => setDeliveryMethod('pakk')}
                  className="mt-0.5 text-[#0e4da4] focus:ring-[#0e4da4]"
                />
                <div>
                  <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                    <span>Paki saatmine (Omniva / DPD)</span>
                    <span className="text-[#0e4da4] font-extrabold">+&#8364;4.90</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Tarne 1-2 t&#246;&#246;p&#228;eva jooksul &#252;le Eesti pakiautomaati v&#245;i kulleriga.
                  </p>
                </div>
              </label>

              {/* Option B: Store Pickup */}
              <label
                className={`border rounded-xl p-3.5 cursor-pointer transition flex items-start space-x-3 ${
                  deliveryMethod === 'pood'
                    ? 'border-[#0e4da4] bg-blue-50/60 ring-2 ring-[#0e4da4]/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="pood"
                  checked={deliveryMethod === 'pood'}
                  onChange={() => setDeliveryMethod('pood')}
                  className="mt-0.5 text-[#0e4da4] focus:ring-[#0e4da4]"
                />
                <div>
                  <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                    <span>Kätte saamine poest</span>
                    <span className="text-emerald-600 font-extrabold">TASUTA (€0.00)</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Lille 14-4 Tallinn 10614 Harjumaa (E-R 10:00 - 18:00). Kaubale saab kohe järele tulla!
                  </p>
                </div>
              </label>
            </div>

            {/* Address fields if parcel selected */}
            {deliveryMethod === 'pakk' && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Aadress & Pakiautomaadi nimi *
                  </label>
                  <input
                    type="text"
                    placeholder="Nt. Endla 45 Omniva pakiautomaat / Sõpruse pst 1"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2 rounded focus:ring-1 focus:ring-[#0e4da4]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Sihtnumber *
                  </label>
                  <input
                    type="text"
                    placeholder="10614"
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2 rounded focus:ring-1 focus:ring-[#0e4da4]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Payment Options REQUIRED */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-[#0e4da4]" />
              <span>3. Makseviis (Payment Method)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Option A: Invoice */}
              <label
                className={`border rounded-xl p-3.5 cursor-pointer transition flex items-start space-x-3 ${
                  paymentMethod === 'arve'
                    ? 'border-[#0e4da4] bg-blue-50/60 ring-2 ring-[#0e4da4]/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="arve"
                  checked={paymentMethod === 'arve'}
                  onChange={() => setPaymentMethod('arve')}
                  className="mt-0.5 text-[#0e4da4] focus:ring-[#0e4da4]"
                />
                <div>
                  <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-[#0e4da4]" />
                    <span>Arve (Invoice)</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Ettemaksuarve saadetakse e-mailile ja väljastatakse kohe allalaadimiseks PDF kujul (maksetähtaeg 7 päeva).
                  </p>
                </div>
              </label>

              {/* Option B: Cash */}
              <label
                className={`border rounded-xl p-3.5 cursor-pointer transition flex items-start space-x-3 ${
                  paymentMethod === 'sularahas'
                    ? 'border-[#0e4da4] bg-blue-50/60 ring-2 ring-[#0e4da4]/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="sularahas"
                  checked={paymentMethod === 'sularahas'}
                  onChange={() => setPaymentMethod('sularahas')}
                  className="mt-0.5 text-[#0e4da4] focus:ring-[#0e4da4]"
                />
                <div>
                  <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Sularahas või kaardiga kohapeal</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Maksa kaubale järele tulles Canman Systems OÜ-s Lille 14-4 Tallinn 10614 Harjumaa.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Order Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-800 text-sm mb-2 pb-1 border-b border-slate-200">
              Tellimuse kokkuvõte ({cart.length} toodet)
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tooted vahesumma:</span>
              <span className="font-semibold text-slate-800">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tarne ({deliveryMethod === 'pakk' ? 'Omniva/DPD' : 'Poe järeletulek'}):</span>
              <span className="font-semibold text-slate-800">€{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Käibemaks 24% (KM sisaldub hinnas):</span>
              <span>€{(totalAmount * 0.24 / 1.24).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-lg pt-2 border-t border-slate-200">
              <span>KOKKU TASUDA:</span>
              <span className="text-[#0e4da4]">€{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-bold py-3 px-6 rounded-xl text-base transition shadow-md flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5 text-yellow-300" />
              <span>Kinnita ja esita tellimus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
