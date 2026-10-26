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
        </div>
      </div>
    </footer>
  );
};
