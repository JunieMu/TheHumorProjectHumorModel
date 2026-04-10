"use client";

import { HumorFlavor } from "@/types/database";
import Link from "next/link";
import { Clock, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ConfirmationModal } from "./ConfirmationModal";

interface HumorFlavorCardProps {
  flavor: HumorFlavor;
  stepCount: number;
  onDeleteSuccess: () => void;
}

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

export function HumorFlavorCard({ flavor, stepCount, onDeleteSuccess }: HumorFlavorCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isActive, setIsActive] = useState(() => getStoredActive(flavor.id));
  const supabase = createClient();

  const effectiveActive = isActive && stepCount > 0;

  const handleToggleActive = () => {
    if (stepCount === 0) return;
    const next = !isActive;
    setIsActive(next);
    setStoredActive(flavor.id, next);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Step 1: Delete steps (Supabase might have ON DELETE CASCADE, but let's be safe if it doesn't)
      await supabase.from("humor_flavor_steps").delete().eq("humor_flavor_id", flavor.id);
      
      // Step 2: Delete flavor
      const { error } = await supabase.from("humor_flavors").delete().eq("id", flavor.id);

      if (error) throw error;
      onDeleteSuccess();
      setIsConfirmOpen(false);
    } catch (err) {
      console.error("Error deleting flavor:", err);
      alert("Failed to delete flavor. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="vintage-border p-4 bg-vintage-cream-dark transition-all hover:-translate-y-1 hover:shadow-lg">
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
              onClick={() => setIsConfirmOpen(true)}
              className="p-2 border border-vintage-gray/20 hover:bg-vintage-pink/30 rounded transition-colors"
            >
              <Trash2 size={16} className="text-vintage-gray" />
            </button>
          </div>
        </div>

        <p className="text-sm font-typewriter text-vintage-gray/80 line-clamp-2 mb-6">
          {flavor.description || "No description provided."}
        </p>

        <div className="flex justify-between items-center">
          <button
            onClick={handleToggleActive}
            title={stepCount === 0 ? "Add steps to activate this flavor" : undefined}
            className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 border border-vintage-gray/20 transition-colors ${
              effectiveActive
                ? "bg-vintage-green hover:bg-vintage-green-dark cursor-pointer"
                : "bg-vintage-gray/10 text-vintage-gray/50 " + (stepCount > 0 ? "hover:bg-vintage-gray/20 cursor-pointer" : "cursor-not-allowed")
            }`}
          >
            {effectiveActive ? "Active" : "Inactive"}
          </button>
          <Link
            href={`/flavors/${flavor.id}`}
            className="text-xs font-bold font-typewriter underline underline-offset-4 hover:text-vintage-blue-dark transition-colors"
          >
            Manage Steps →
          </Link>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => !isDeleting && setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Expunge Flavor?"
        message={`This action will permanently remove "${flavor.slug}" and all associated pipeline steps from the archive. This cannot be undone.`}
        confirmText="Expunge Record"
        variant="danger"
      />
    </>
  );
}
