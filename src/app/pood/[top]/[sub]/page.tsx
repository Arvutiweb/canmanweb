export default function Page({ params }: { params: { top: string, sub: string } }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold" style={{color:'#0e4da4'}}>
        {params.top} / {params.sub}
      </h1>
      <p className="mt-4">Tooted siin...</p>
    </div>
  );
}
