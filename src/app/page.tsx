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

          <div className="vintage-border p-6 bg-vintage-cream-dark">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-3">
              About This Tool
            </h3>
            <p className="font-typewriter text-xs text-vintage-gray/70 leading-relaxed">
              The Humor Model Project is a research tool for designing and testing <span className="italic">humor flavors</span> — configurable prompt pipelines that instruct an LLM to generate funny captions for a given image. Each flavor is made up of an ordered chain of steps, where each step defines a system prompt, user prompt, model, and temperature.
            </p>
          </div>

          <div className="vintage-border p-6 bg-vintage-green/20">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-3">
              Testing a Flavor
            </h3>
            <ol className="font-typewriter text-xs text-vintage-gray/70 leading-relaxed space-y-2 list-none">
              <li><span className="font-bold text-vintage-gray">1.</span> Open a flavor and click <span className="font-bold">Test Flavor</span>, or use <span className="font-bold">Test Image Pipeline</span> from the sidebar to pick any flavor.</li>
              <li><span className="font-bold text-vintage-gray">2.</span> Upload an image — the pipeline will request a presigned URL, upload your image, register it, then run the prompt chain.</li>
              <li><span className="font-bold text-vintage-gray">3.</span> Generated captions appear in the Results Output panel.</li>
            </ol>
          </div>

          <div className="vintage-border p-6 bg-vintage-yellow/20">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-3">
              Creating a Flavor
            </h3>
            <ol className="font-typewriter text-xs text-vintage-gray/70 leading-relaxed space-y-2 list-none">
              <li><span className="font-bold text-vintage-gray">1.</span> Click <span className="font-bold">New Flavor</span> and give it a slug (e.g. <span className="italic">dry-wit</span>) and a description of the comedic style.</li>
              <li><span className="font-bold text-vintage-gray">2.</span> Open the flavor and click <span className="font-bold">Add Step</span> to build out the prompt chain.</li>
              <li><span className="font-bold text-vintage-gray">3.</span> For each step, set the model, step type, input/output types, prompts, and temperature.</li>
              <li><span className="font-bold text-vintage-gray">4.</span> Use the arrows to reorder steps. A flavor with no steps is automatically marked <span className="font-bold">Inactive</span>.</li>
            </ol>
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
