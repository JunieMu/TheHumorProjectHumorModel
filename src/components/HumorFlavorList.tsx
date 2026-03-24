"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { HumorFlavor } from "@/types/database";
import { HumorFlavorCard } from "./HumorFlavorCard";
import { CreateFlavorModal } from "./CreateFlavorModal";
import { Loader2, Plus } from "lucide-react";

export function HumorFlavorList() {
  const [flavors, setFlavors] = useState<HumorFlavor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchFlavors = useCallback(async () => {
    setLoading(true);
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
  }, [supabase]);

  useEffect(() => {
    fetchFlavors();
  }, [fetchFlavors]);

  if (loading && flavors.length === 0) {
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
          onClick={() => fetchFlavors()}
          className="mt-4 text-xs underline underline-offset-4 font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-typewriter text-vintage-gray">
          Active Flavors
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="vintage-button text-sm uppercase font-bold tracking-tight flex items-center gap-2"
        >
          <Plus size={16} />
          New Flavor
        </button>
      </div>

      {flavors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-vintage-cream/50 border-2 border-dashed border-vintage-gray/20">
          <p className="font-typewriter text-sm text-vintage-gray/60 italic mb-6">
            The flavor archives are currently empty.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="vintage-button text-xs uppercase font-bold"
          >
            Create Your First Flavor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {flavors.map((flavor) => (
            <HumorFlavorCard key={flavor.id} flavor={flavor} onDeleteSuccess={fetchFlavors} />
          ))}
        </div>
      )}

      <CreateFlavorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchFlavors} 
      />
    </>
  );
}
