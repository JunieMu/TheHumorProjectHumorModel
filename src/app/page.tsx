"use client";

import { useState } from "react";
import { HumorFlavorList } from "@/components/HumorFlavorList";
import { LogoutButton } from "@/components/LogoutButton";
import { ProjectStats } from "@/components/ProjectStats";
import { GeneralTestModal } from "@/components/GeneralTestModal";
import { Play, Activity } from "lucide-react";

export default function Home() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

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
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4 flex items-center gap-2">
              <Activity size={18} />
              Project Stats
            </h3>
            <ProjectStats />
          </div>

          <div className="vintage-border p-6 bg-vintage-pink/20 plaid-pattern">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsTestModalOpen(true)}
                className="vintage-button text-xs uppercase font-bold flex items-center justify-center gap-2 py-2"
              >
                <Play size={14} />
                Test Image Pipeline
              </button>
            </div>
          </div>

          <div className="vintage-border p-6 bg-vintage-yellow/20">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4">
              System Notice
            </h3>
            <p className="font-typewriter text-[10px] text-vintage-gray/60 leading-relaxed italic">
              "Every successful flavor extraction begins with a precisely calibrated prompt chain. Ensure all steps are documented in the archive."
            </p>
          </div>
        </aside>
      </div>

      <GeneralTestModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
      />
    </main>
  );
}
