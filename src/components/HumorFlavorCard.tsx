"use client";

import { HumorFlavor } from "@/types/database";
import Link from "next/link";
import { Clock, Edit3, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface HumorFlavorCardProps {
  flavor: HumorFlavor;
  onDeleteSuccess: () => void;
}

export function HumorFlavorCard({ flavor, onDeleteSuccess }: HumorFlavorCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the flavor "${flavor.slug}"? This will also delete all associated steps.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Step 1: Delete steps (Supabase might have ON DELETE CASCADE, but let's be safe if it doesn't)
      await supabase.from("humor_flavor_steps").delete().eq("humor_flavor_id", flavor.id);
      
      // Step 2: Delete flavor
      const { error } = await supabase.from("humor_flavors").delete().eq("id", flavor.id);

      if (error) throw error;
      onDeleteSuccess();
    } catch (err) {
      console.error("Error deleting flavor:", err);
      alert("Failed to delete flavor. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="vintage-border p-6 bg-vintage-cream-dark transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold font-typewriter text-vintage-gray uppercase">
            {flavor.slug}
          </h3>
          <div className="flex items-center text-xs text-vintage-gray/60 mt-1 font-typewriter italic">
            <Clock size={12} className="mr-1" />
            Updated {new Date(flavor.modified_datetime_utc).toLocaleDateString()}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/flavors/${flavor.id}`}
            className="p-2 border border-vintage-gray/20 hover:bg-vintage-blue/30 rounded transition-colors"
          >
            <Edit3 size={16} className="text-vintage-gray" />
          </Link>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 border border-vintage-gray/20 hover:bg-vintage-pink/30 rounded transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin text-vintage-gray" />
            ) : (
              <Trash2 size={16} className="text-vintage-gray" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm font-typewriter text-vintage-gray/80 line-clamp-2 mb-6">
        {flavor.description || "No description provided."}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-tighter bg-vintage-green px-2 py-0.5 border border-vintage-gray/20">
          Active
        </span>
        <Link
          href={`/flavors/${flavor.id}`}
          className="text-xs font-bold font-typewriter underline underline-offset-4 hover:text-vintage-blue-dark transition-colors"
        >
          Manage Steps →
        </Link>
      </div>
    </div>
  );
}
