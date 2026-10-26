export const Footer = ({ onOpenServicesModal, onServicesOpen }: any) => {
  const handleServices = onServicesOpen || onOpenServicesModal;
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold">Canman</h3>
            <p className="mt-2 text-sm">Sinu e-pood</p>
          </div>
          <div>
            <h3 className="text-white font-bold">Kontakt</h3>
            <a href="tel:+3725652062" className="mt-2 inline-block text-sm hover:text-white transition-colors">
              +372 5652062
            </a>
          </div>
          <div>
            {handleServices && (
              <button onClick={handleServices} className="text-sm hover:text-white transition-colors">
                Arvutiremont ja IT-abi
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
