import Link from 'next/link';

type Props = {
  params: { top: string };
};

const CATEGORY_NAMES: Record<string, string> = {
  'kontoritarbed': 'Kontoritarbed',
  'koolitarbed': 'Koolitarbed',
  'tehnika': 'Tehnika',
  'majapidamine': 'Majapidamine',
};

export default function PoodTopPage({ params }: Props) {
  const slug = params.top;
  const name = CATEGORY_NAMES[slug] || slug;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{color:'#0e4da4'}}>
        {name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/pood/${slug}/pliiatsid`} className="border p-4 rounded hover:shadow">
          <h3 className="font-bold">Alamkategooria näide</h3>
          <p className="text-sm text-gray-500">Tooted tulevad siia</p>
        </Link>
      </div>
      <div className="mt-6">
        <Link href="/pood" className="text-blue-600 underline">
          ← Tagasi poodi
        </Link>
      </div>
    </div>
  );
}
