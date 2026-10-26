import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '../context/CartContext';

export const metadata: Metadata = {
  title: 'Canman - Arvutid, Kasutatud Arvutid & IT Remont Tallinnas',
  description: 'Canman e-pood (canman.github.io): Uued ja kasutatud arvutid, sülearvutid, arvutiosad, monitorid ja printerid Tallinnas. IT abi, remont ja tehniku väljakutsed. Tel 5652062, Lille 14 Tallinn.',
  keywords: [
    'arvutid',
    'kasutatud arvutid',
    'arvutiremont Tallinnas',
    'sülearvutid',
    'DELL',
    'Lenovo',
    'HP',
    'Apple',
    'monitorid',
    'arvutiosad',
    'IT abi',
    'Lille 14 Tallinn',
  ],
  authors: [{ name: 'Canman OÜ' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
