"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { HumorFlavor } from "@/types/database";
import { HumorFlavorCard } from "./HumorFlavorCard";
import { CreateFlavorModal } from "./CreateFlavorModal";
import { Loader2, Plus } from "lucide-react";

type FlavorWithCount = HumorFlavor & {
  stepCount: number;
  captionCount: number;
};

type SortOption = "recent" | "oldest" | "az" | "za" | "most-steps" | "most-captions";
type ActiveFilter = "all" | "active" | "inactive";

function getStoredActive(flavorId: number): boolean {
  try {
    const val = localStorage.getItem(`flavor_active_${flavorId}`);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

function setStoredActive(flavorId: number, value: boolean) {
  try {
    localStorage.setItem(`flavor_active_${flavorId}`, String(value));
  } catch {
    // ignore
  }
}

export function HumorFlavorList() {
  const [flavors, setFlavors] = useState<FlavorWithCount[]>([]);
  const [activeMap, setActiveMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  const fetchFlavors = useCallback(async () => {
    setLoading(true);
    try {
      const { data: flavorsData, error: flavorsError } = await supabase
        .from("humor_flavors")
        .select("*")
        .order("modified_datetime_utc", { ascending: false });

      if (flavorsError) throw flavorsError;

      const [{ data: stepsData, error: stepsError }, { data: captionsData, error: captionsError }] =
        await Promise.all([
          supabase.from("humor_flavor_steps").select("humor_flavor_id").limit(10000),
          supabase.from("captions").select("humor_flavor_id").limit(10000),
        ]);

      if (stepsError) throw stepsError;
      if (captionsError) throw captionsError;

      const stepCounts: Record<number, number> = {};
      for (const s of stepsData || []) {
        stepCounts[s.humor_flavor_id] = (stepCounts[s.humor_flavor_id] || 0) + 1;
      }

      const captionCounts: Record<number, number> = {};
      for (const c of captionsData || []) {
        if (c.humor_flavor_id != null)
          captionCounts[c.humor_flavor_id] = (captionCounts[c.humor_flavor_id] || 0) + 1;
      }

      const merged = (flavorsData || []).map((f) => ({
        ...f,
        stepCount: stepCounts[f.id] ?? 0,
        captionCount: captionCounts[f.id] ?? 0,
      }));

      // Initialise localStorage active state for each flavor
      const map: Record<number, boolean> = {};
      for (const f of merged) {
        map[f.id] = getStoredActive(f.id);
      }

      setFlavors(merged);
      setActiveMap(map);
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

  const handleToggleActive = (flavorId: number, stepCount: number) => {
    if (stepCount === 0) return;
    const next = !activeMap[flavorId];
    setStoredActive(flavorId, next);
    setActiveMap((prev) => ({ ...prev, [flavorId]: next }));
  };

  const getEffectiveActive = (f: FlavorWithCount) =>
    activeMap[f.id] !== false && f.stepCount > 0;

  const sorted = [...flavors].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.slug.localeCompare(b.slug);
      case "za":
        return b.slug.localeCompare(a.slug);
      case "oldest":
        return new Date(a.modified_datetime_utc).getTime() - new Date(b.modified_datetime_utc).getTime();
      case "most-steps":
        return b.stepCount - a.stepCount;
      case "most-captions":
        return b.captionCount - a.captionCount;
      case "recent":
      default:
        return new Date(b.modified_datetime_utc).getTime() - new Date(a.modified_datetime_utc).getTime();
    }
  });

  const filtered = sorted.filter((f) => {
    if (activeFilter !== "all") {
      const ea = getEffectiveActive(f);
      if (activeFilter === "active" && !ea) return false;
      if (activeFilter === "inactive" && ea) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.slug.toLowerCase().includes(q) ||
        (f.description ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

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

  const SORT_LABELS: Record<SortOption, string> = {
    recent: "Most Recent",
    oldest: "Oldest",
    az: "A → Z",
    za: "Z → A",
    "most-steps": "Most Steps",
    "most-captions": "Most Captions",
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-typewriter text-vintage-gray">
          Flavor Archives
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="vintage-button text-sm uppercase font-bold tracking-tight flex items-center gap-2"
        >
          <Plus size={16} />
          New Flavor
        </button>
      </div>

      {/* Controls */}
      <div className="vintage-border bg-vintage-cream-dark p-4 mb-5 space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search archives..."
          className="w-full bg-transparent border-b border-vintage-gray/30 focus:border-vintage-gray outline-none py-1 text-sm font-typewriter italic text-vintage-gray placeholder:text-vintage-gray/30"
        />
        <div className="border-t border-vintage-gray/10" />
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-vintage-gray/40 font-typewriter w-12 shrink-0">
            Sort
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`text-xs font-typewriter transition-colors ${
                  sortBy === key
                    ? "font-bold text-vintage-gray underline underline-offset-4 decoration-vintage-yellow-dark"
                    : "text-vintage-gray/40 hover:text-vintage-gray/70"
                }`}
              >
                {SORT_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-vintage-gray/10" />

        <div className="flex items-baseline gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-vintage-gray/40 font-typewriter w-12 shrink-0">
            Show
          </span>
          <div className="flex gap-5">
            {(["all", "active", "inactive"] as ActiveFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs font-typewriter capitalize transition-colors ${
                  activeFilter === f
                    ? "font-bold text-vintage-gray underline underline-offset-4 decoration-vintage-yellow-dark"
                    : "text-vintage-gray/40 hover:text-vintage-gray/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
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
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-vintage-cream/50 border-2 border-dashed border-vintage-gray/20">
          <p className="font-typewriter text-sm text-vintage-gray/60 italic">
            No flavors match the current filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((flavor) => (
            <HumorFlavorCard
              key={flavor.id}
              flavor={flavor}
              stepCount={flavor.stepCount}
              captionCount={flavor.captionCount}
              isActive={getEffectiveActive(flavor)}
              onToggleActive={() => handleToggleActive(flavor.id, flavor.stepCount)}
              onDeleteSuccess={fetchFlavors}
            />
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
