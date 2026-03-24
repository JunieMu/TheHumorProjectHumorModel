"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HumorFlavor } from "@/types/database";
import { HumorFlavorCard } from "./HumorFlavorCard";
import { Loader2 } from "lucide-react";

export function HumorFlavorList() {
  const [flavors, setFlavors] = useState<HumorFlavor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlavors() {
      try {
        const { data, error } = await supabase
          .from("humor_flavors")
          .select("*")
          .order("modified_datetime_utc", { ascending: false });

        if (error) throw error;
        setFlavors(data || []);
      } catch (err: any) {
        console.error("Error fetching flavors:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlavors();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-vintage-cream/50 border-2 border-dashed border-vintage-gray/20">
        <Loader2 className="animate-spin text-vintage-blue-dark mb-4" />
        <p className="font-typewriter text-sm text-vintage-gray/60 italic">
          Retrieving flavor archives...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-vintage-pink/10 border-2 border-vintage-pink/30 text-vintage-pink-dark font-typewriter">
        <h3 className="font-bold mb-2 uppercase">Error Retrieving Data</h3>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-xs underline underline-offset-4 font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (flavors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-vintage-cream/50 border-2 border-dashed border-vintage-gray/20">
        <p className="font-typewriter text-sm text-vintage-gray/60 italic mb-6">
          The flavor archives are currently empty.
        </p>
        <button className="vintage-button text-xs uppercase font-bold">
          Create Your First Flavor
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {flavors.map((flavor) => (
        <HumorFlavorCard key={flavor.id} flavor={flavor} />
      ))}
    </div>
  );
}
