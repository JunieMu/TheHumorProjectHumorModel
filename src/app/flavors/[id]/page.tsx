import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";

interface FlavorPageProps {
  params: { id: string };
}

export default function FlavorPage({ params }: FlavorPageProps) {
  const flavorId = params.id;

  return (
    <main className="max-w-6xl mx-auto p-8">
      <header className="mb-12 border-b-2 border-vintage-gray pb-6 flex justify-between items-end">
        <div>
          <Link
            href="/"
            className="flex items-center text-xs font-bold font-typewriter uppercase mb-4 hover:text-vintage-blue-dark transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" />
            Back to Archives
          </Link>
          <h1 className="text-4xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray">
            Flavor Management
          </h1>
          <p className="text-vintage-gray/70 mt-2 font-typewriter italic">
            Currently editing flavor index: {flavorId}
          </p>
        </div>
        <button className="vintage-button flex items-center gap-2 bg-vintage-green hover:bg-vintage-green-dark">
          <Play size={18} />
          <span className="font-bold uppercase tracking-tight">Test Flavor</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-typewriter text-vintage-gray uppercase">
                Prompt Steps
              </h2>
              <button className="vintage-button text-xs uppercase font-bold tracking-tight">
                + Add Step
              </button>
            </div>
            
            {/* Steps will go here */}
            <div className="flex flex-col items-center justify-center py-20 bg-vintage-cream/50 border-2 border-dashed border-vintage-gray/20">
              <p className="font-typewriter text-sm text-vintage-gray/60 italic">
                This flavor currently has no steps defined.
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="vintage-border p-6 bg-vintage-cream-dark">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4 border-b border-vintage-gray/20 pb-2">
              Flavor Details
            </h3>
            <form className="space-y-4 font-typewriter text-sm">
              <div>
                <label className="block font-bold uppercase mb-1">Slug</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-vintage-gray/50 focus:border-vintage-blue-dark outline-none py-1"
                  placeholder="e.g. funny-sarcastic"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Description</label>
                <textarea
                  className="w-full bg-transparent border border-vintage-gray/30 focus:border-vintage-blue-dark outline-none p-2 min-h-[100px]"
                  placeholder="What makes this flavor unique?"
                />
              </div>
              <button className="vintage-button w-full mt-4 text-xs uppercase font-bold">
                Save Changes
              </button>
            </form>
          </div>

          <div className="vintage-border p-6 bg-vintage-blue/20 plaid-pattern">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4">
              Helpful Hints
            </h3>
            <p className="font-typewriter text-xs text-vintage-gray/80 leading-relaxed italic">
              "A good flavor starts with a clear description of the image, followed by a witty observation."
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
