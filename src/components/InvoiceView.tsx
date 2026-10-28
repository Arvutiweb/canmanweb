'use client';
import React from 'react';
import { Printer, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { OrderDetails } from '../types';

interface InvoiceViewProps {
  order: OrderDetails;
  onClose: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    const content = document.getElementById('printable-invoice')?.innerHTML;
    if (!content) return;
    const win = window.open('', '', 'height=800,width=1000');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Ettemaksuarve ${order.orderNumber}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: #1e293b; background: white; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #0e4da4; color: white; padding: 10px; text-align: left; font-size: 11px; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const docTitle = order.paymentMethod === 'arve' ? 'Ettemaksu Arve / Preforma Invoice' : 'Tellimuse Kinnitus / Order Confirmation';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center px-4 pt-16 pb-4 print:!static print:!bg-white print:!p-0 print:!overflow-visible">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-0 print:!shadow-none print:!rounded-none print:!m-0 print:!max-w-none print:!w-full">
        <div className="bg-[#0e4da4] text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Tellimus #{order.orderNumber} - Ettemaksu arve valmis!</span>
            </div>
            <div className="text-[11px] text-blue-100 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-yellow-300" />
              <span>Saadetud: <strong>{order.customer.email}</strong> ja <strong>canman.systems@gmail.com</strong></span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrint} className="bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1">
              <Printer className="w-4 h-4" />
              <span>Prindi / PDF</span>
            </button>
            <button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Tagasi</span>
            </button>
          </div>
        </div>
        <div id="printable-invoice" className="p-8 text-slate-800 text-xs bg-white print:!p-0">
          <div className="flex justify-between items-start border-b-2 border-[#0e4da4] pb-5 mb-5">
            <div>
              <h1 className="text-2xl font-black text-[#0e4da4] tracking-tight mb-1">CANMAN SYSTEMS<span className="text-red-600 font-bold text-sm ml-1">OÜ</span></h1>
              <div className="mt-2 space-y-0.5 text-slate-700 text-xs leading-tight">
                <p><strong>Reg.nr.</strong> 12147369 | <strong>K/M</strong> EE101478366</p>
                <p>Lille 14-4 Tallinn 10614 Harjumaa</p>
                <p>Tel. 372 5652062 | canman.systems@gmail.com</p>
                <p className="font-bold text-[#0e4da4]">Pank: LHV EE517700771001586069</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-amber-50 border border-amber-300 px-4 py-2 rounded-lg mb-2">
                <div className="text-[10px] uppercase font-black text-amber-800 tracking-wide">{docTitle}</div>
                <div className="text-lg font-black text-[#0e4da4]">Nr. {order.orderNumber}</div>
              </div>
              <p className="text-slate-500 text-xs">Kuupäev: <strong>{new Date(order.createdAt).toLocaleDateString('et-EE')}</strong></p>
              <p className="text-slate-500 text-xs">Maksetähtaeg: <strong>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('et-EE')}</strong></p>
              <p className="text-[10px] text-amber-700 mt-1 italic">* Lõplik arve saadetakse koos kaubaga pärast laekumist</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-[#0e4da4] uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">OSTJA / BUYER:</h3>
              <p className="font-bold text-sm text-slate-900">{order.customer.fullName}</p>
              {order.customer.companyName && <p className="font-semibold text-slate-700">{order.customer.companyName}</p>}
              <p className="text-slate-600 mt-1 text-xs">E-post: {order.customer.email}</p>
              <p className="text-slate-600 text-xs">Tel: {order.customer.phone}</p>
            </div>
            <div>
              <h3 className="font-bold text-[#0e4da4] uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">TARNE / DELIVERY:</h3>
              <p className="text-slate-700 text-xs">Tarneviis: <strong>{order.deliveryMethod === 'pakk'? 'Omniva / DPD Pakiautomaat' : 'Kätte saamine: Lille 14-4 Tallinn 10614 Harjumaa'}</strong></p>
              {order.deliveryMethod === 'pakk' && <p className="text-slate-800 font-semibold mt-1 text-xs">Pakiautomaat: {order.customer.address}</p>}
              <p className="text-slate-700 mt-1 text-xs">Makseviis: <strong>{order.paymentMethod === 'arve'? 'Pangaülekanne (ettemaks)' : 'Sularaha / Kaart'}</strong></p>
            </div>
          </div>
          <div className="mb-5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0e4da4] text-white text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">Toode / Product</th>
                  <th className="py-2.5 px-3">Spec</th>
                  <th className="py-2.5 px-3 text-center">Kogus</th>
                  <th className="py-2.5 px-3 text-right">Hind</th>
                  <th className="py-2.5 px-3 text-right">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {order.items.map(({ product, quantity }) => (
                  <tr key={product.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{product.title}<span className="block text-[10px] text-slate-500 font-normal">{product.condition}</span></td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{product.shortSpec}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{quantity}</td>
                    <td className="py-2.5 px-3 text-right">€{product.price.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">€{(product.price * quantity).toFixed(2)}</td>
                  </tr>
                ))}
                {order.deliveryFee > 0 && (
                  <tr>
                    <td colSpan={2} className="py-2 px-3 font-semibold text-slate-700">Paki saatmine / Shipping</td>
                    <td className="py-2 px-3 text-center">1</td>
                    <td className="py-2 px-3 text-right">€{order.deliveryFee.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-bold">€{order.deliveryFee.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-start mb-5">
            <div className="text-[11px] text-slate-600 max-w-[55%] bg-amber-50 border border-amber-200 rounded-lg p-2.5">
              <p className="font-bold text-amber-900 text-xs mb-1">TÄHELEPANU:</p>
              <p>See on ettemaksu arve. Lõplik arve saadetakse koos kaubaga pärast makse laekumist.</p>
            </div>
            <div className="w-60 space-y-1 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600"><span>Neto:</span><span>€{(order.total - order.tax).toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-600"><span>KM 24%:</span><span>€{order.tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1.5 border-t border-slate-300"><span>KOKKU / TOTAL:</span><span className="text-[#0e4da4]">€{order.total.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 mb-5">
            <p><strong>Maksejuhis:</strong> Palun tasuda <strong>€{order.total.toFixed(2)}</strong> arvele <strong>EE517700771001586069</strong> (Canman Systems OÜ). Selgitus: <strong>Nr. {order.orderNumber}</strong>.</p>
          </div>
          <div className="border-t border-slate-300 pt-4 grid grid-cols-2 gap-10 text-xs">
            <div>
              <p className="mb-8 text-slate-600 italic">Nõustun arvega, kaup kätte saadud,</p>
              <div className="space-y-8">
                <div className="flex gap-2"><span className="w-16">Allkiri:</span><span className="flex-1 border-b border-slate-400"></span></div>
                <div className="flex gap-2"><span className="w-16">Kuupäev:</span><span className="flex-1 border-b border-slate-400"></span><span className="ml-2 text-slate-400">. . . . . . .</span></div>
              </div>
            </div>
            <div className="mt-6 border-t border-slate-300 pt-4 text-xs text-slate-700">
              <h3 className="font-bold text-slate-900 mb-2">Ettemaksu tingimused</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Pakkumine kehtib 7 kalendripäeva alates arve väljastamisest.</li>
                <li>Tasumise tähtaeg: 7 kalendripäeva.</li>
                <li>Kaup komplekteeritakse pärast ettemaksu laekumist.</li>
                <li>Kauba eeldatav lähetusaeg teatatakse ostjale e-posti teel pärast ettemaksu laekumist.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
