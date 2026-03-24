import { HumorFlavorList } from "@/components/HumorFlavorList";
import { LogoutButton } from "@/components/LogoutButton";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-8">
      <header className="mb-12 border-b-2 border-vintage-gray pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray">
            The Humor Model Project
          </h1>
          <p className="text-vintage-gray/70 mt-2 font-typewriter italic">
            Drafting the finest humor flavors since 2026.
          </p>
        </div>
        <LogoutButton />
      </header>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          <HumorFlavorList />
        </section>

        <aside className="space-y-6">
          <div className="vintage-border p-6 bg-vintage-blue/20">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4">
              Project Stats
            </h3>
            <ul className="space-y-2 font-typewriter text-sm">
              <li className="flex justify-between">
                <span>Total Flavors:</span>
                <span className="font-bold">0</span>
              </li>
              <li className="flex justify-between">
                <span>Total Steps:</span>
                <span className="font-bold">0</span>
              </li>
              <li className="flex justify-between">
                <span>Captions Generated:</span>
                <span className="font-bold">0</span>
              </li>
            </ul>
          </div>

          <div className="vintage-border p-6 bg-vintage-pink/20 plaid-pattern">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <button className="vintage-button text-xs uppercase font-bold">
                Test Image Pipeline
              </button>
              <button className="vintage-button text-xs uppercase font-bold">
                Export Schema
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
