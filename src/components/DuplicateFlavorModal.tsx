"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { HumorFlavor } from "@/types/database";
import { X, Loader2, Copy } from "lucide-react";

interface DuplicateFlavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flavor: HumorFlavor;
}

export function DuplicateFlavorModal({
  isOpen,
  onClose,
  onSuccess,
  flavor,
}: DuplicateFlavorModalProps) {
  const [slug, setSlug] = useState(`${flavor.slug}-copy`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      setSlug(`${flavor.slug}-copy`);
      setError(null);
    }
  }, [isOpen, flavor.slug]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Insert new flavor
      const { data: newFlavor, error: flavorError } = await supabase
        .from("humor_flavors")
        .insert([{
          slug: slug.toLowerCase().replace(/\s+/g, "-"),
          description: flavor.description,
        }])
        .select()
        .single();

      if (flavorError) throw flavorError;

      // 2. Fetch original steps
      const { data: steps, error: stepsError } = await supabase
        .from("humor_flavor_steps")
        .select("*")
        .eq("humor_flavor_id", flavor.id)
        .order("order_by", { ascending: true });

      if (stepsError) throw stepsError;

      // 3. Insert copied steps under new flavor
      if (steps && steps.length > 0) {
        const stepCopies = steps.map((s) => ({
          humor_flavor_id: newFlavor.id,
          description: s.description,
          llm_model_id: s.llm_model_id,
          humor_flavor_step_type_id: s.humor_flavor_step_type_id,
          llm_input_type_id: s.llm_input_type_id,
          llm_output_type_id: s.llm_output_type_id,
          llm_system_prompt: s.llm_system_prompt,
          llm_user_prompt: s.llm_user_prompt,
          llm_temperature: s.llm_temperature,
          order_by: s.order_by,
          modified_datetime_utc: new Date().toISOString(),
        }));

        const { error: insertError } = await supabase
          .from("humor_flavor_steps")
          .insert(stepCopies);

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error duplicating flavor:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vintage-gray/40 backdrop-blur-sm">
      <div className="vintage-border bg-vintage-cream w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-vintage-gray/60 hover:text-vintage-gray transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <Copy size={18} className="text-vintage-gray/60" />
          <h2 className="text-2xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray">
            Duplicate Flavor
          </h2>
        </div>
        <p className="font-typewriter text-xs text-vintage-gray/50 italic mb-6">
          Copying <span className="font-bold not-italic">{flavor.slug}</span> and all its steps into a new entry.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 font-typewriter">
          {error && (
            <div className="p-3 bg-vintage-pink/10 border border-vintage-pink-dark text-vintage-pink-dark text-xs uppercase font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
              New Flavor Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-transparent border-b-2 border-vintage-gray/30 focus:border-vintage-blue-dark outline-none py-2 text-sm"
            />
            <p className="mt-1 text-[10px] text-vintage-gray/50 italic">
              Use lowercase and dashes. Must be unique.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-vintage-gray/20 text-xs font-bold uppercase hover:bg-vintage-gray/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 vintage-button bg-vintage-blue/40 hover:bg-vintage-blue/60 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Copy size={16} />
              )}
              <span className="font-bold uppercase text-xs">
                {loading ? "Duplicating..." : "Duplicate"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
