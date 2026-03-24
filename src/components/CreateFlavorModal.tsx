"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Loader2 } from "lucide-react";

interface CreateFlavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateFlavorModal({ isOpen, onClose, onSuccess }: CreateFlavorModalProps) {
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("humor_flavors")
        .insert([
          {
            slug: slug.toLowerCase().replace(/\s+/g, "-"),
            description,
          },
        ]);

      if (insertError) throw insertError;

      onSuccess();
      onClose();
      setSlug("");
      setDescription("");
    } catch (err: any) {
      console.error("Error creating flavor:", err);
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

        <h2 className="text-2xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray mb-6">
          New Flavor Entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 font-typewriter">
          {error && (
            <div className="p-3 bg-vintage-pink/10 border border-vintage-pink-dark text-vintage-pink-dark text-xs uppercase font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
              Flavor Slug (Identifier)
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. sarcastic-british"
              className="w-full bg-transparent border-b-2 border-vintage-gray/30 focus:border-vintage-blue-dark outline-none py-2 text-sm"
            />
            <p className="mt-1 text-[10px] text-vintage-gray/50 italic">
              Use lowercase and dashes. No spaces allowed.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
              Description / Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Define the essence of this humor flavor..."
              className="w-full bg-transparent border-2 border-vintage-gray/20 focus:border-vintage-blue-dark outline-none p-3 text-sm min-h-[120px]"
            />
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
              className="flex-1 vintage-button bg-vintage-green hover:bg-vintage-green-dark disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" size={18} />
              ) : (
                <span className="font-bold uppercase text-xs">Record Flavor</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
