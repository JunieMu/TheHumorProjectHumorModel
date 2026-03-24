"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export function ProjectStats() {
  const [stats, setStats] = useState({
    flavors: 0,
    steps: 0,
    captions: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [flavorsRes, stepsRes, captionsRes] = await Promise.all([
          supabase.from("humor_flavors").select("*", { count: "exact", head: true }),
          supabase.from("humor_flavor_steps").select("*", { count: "exact", head: true }),
          supabase.from("captions").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          flavors: flavorsRes.count || 0,
          steps: stepsRes.count || 0,
          captions: captionsRes.count || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="animate-spin text-vintage-blue-dark" size={20} />
      </div>
    );
  }

  return (
    <ul className="space-y-2 font-typewriter text-sm">
      <li className="flex justify-between border-b border-vintage-gray/10 pb-1">
        <span className="text-vintage-gray/60 uppercase text-[10px] font-bold">Total Flavors:</span>
        <span className="font-bold text-vintage-gray">{stats.flavors}</span>
      </li>
      <li className="flex justify-between border-b border-vintage-gray/10 pb-1">
        <span className="text-vintage-gray/60 uppercase text-[10px] font-bold">Total Steps:</span>
        <span className="font-bold text-vintage-gray">{stats.steps}</span>
      </li>
      <li className="flex justify-between border-b border-vintage-gray/10 pb-1">
        <span className="text-vintage-gray/60 uppercase text-[10px] font-bold">Captions Generated:</span>
        <span className="font-bold text-vintage-gray">{stats.captions}</span>
      </li>
    </ul>
  );
}
