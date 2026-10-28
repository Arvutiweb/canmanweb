import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata: Metadata = {
  title: 'Canman - IT-Teenused, Arvutiremont & IT-Haldus Tallinnas | canman.eu',
  description: 'Canman Systems OÜ (canman.eu): Professionaalsed IT-teenused, arvutite ja sülearvutite kiirremont ning IT-haldus äriklientidele Tallinnas ja Harjumaal. Kontrollitud garantiiga äriklassi arvutid ja varuosad. Tel +372 5652 062, Lille 14-4, Tallinn.',
  keywords: [
    'IT-teenused',
    'arvutiremont Tallinnas',
    'IT abi',
    'IT haldus',
    'sülearvutite remont',
    'arvutid',
    'kasutatud arvutid',
    'DELL',
    'Lenovo',
    'HP',
    'Apple',
    'monitorid',
    'Lille 14 Tallinn',
  ],
  authors: [{ name: 'Canman Systems OÜ' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et" className="scroll-smooth">
      <body className="bg-[#ebf5f6] text-slate-900 min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
