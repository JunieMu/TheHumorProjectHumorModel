"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { HumorFlavor } from "@/types/database";
import Link from "next/link";
import { ArrowLeft, Play, Loader2, Save, Trash2 } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { useRouter } from "next/navigation";

import { HumorFlavorStepList } from "@/components/HumorFlavorStepList";

interface FlavorPageProps {
  params: { id: string };
}

export default function FlavorPage({ params }: FlavorPageProps) {
  const flavorId = params.id;
  const numericFlavorId = parseInt(flavorId);
  const router = useRouter();
  const [flavor, setFlavor] = useState<HumorFlavor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ slug: "", description: "" });
  const supabase = createClient();

  useEffect(() => {
    async function fetchFlavor() {
      try {
        const { data, error } = await supabase
          .from("humor_flavors")
          .select("*")
          .eq("id", flavorId)
          .single();

        if (error) throw error;
        setFlavor(data);
        setFormData({ slug: data.slug, description: data.description || "" });
      } catch (err: any) {
        console.error("Error fetching flavor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlavor();
  }, [flavorId, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from("humor_flavors")
        .update({
          slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
          description: formData.description,
          modified_datetime_utc: new Date().toISOString(),
        })
        .eq("id", flavorId);

      if (error) throw error;
      alert("Flavor updated successfully.");
    } catch (err: any) {
      console.error("Error updating flavor:", err);
      alert("Failed to update flavor: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center vintage-paper">
        <Loader2 className="animate-spin text-vintage-blue-dark mr-2" />
        <span className="font-typewriter italic">Opening archive index {flavorId}...</span>
      </div>
    );
  }

  if (error || !flavor) {
    return (
      <main className="max-w-6xl mx-auto p-8 font-typewriter">
        <div className="vintage-border p-12 bg-vintage-pink/10 text-center">
          <h2 className="text-2xl font-bold uppercase text-vintage-pink-dark mb-4">Entry Not Found</h2>
          <p className="mb-8">We could not retrieve flavor index {flavorId} from the archives.</p>
          <Link href="/" className="vintage-button text-xs uppercase font-bold">Return to Archives</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <header className="mb-12 border-b-2 border-vintage-gray pb-6 flex justify-between items-end">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <Link
              href="/"
              className="flex items-center text-xs font-bold font-typewriter uppercase mb-4 hover:text-vintage-blue-dark transition-colors"
            >
              <ArrowLeft size={14} className="mr-1" />
              Back to Archives
            </Link>
            <LogoutButton />
          </div>
          <h1 className="text-4xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray">
            Flavor Management
          </h1>
          <p className="text-vintage-gray/70 mt-2 font-typewriter italic">
            Entry ID: {flavor.id} • Registered {new Date(flavor.created_datetime_utc).toLocaleDateString()}
          </p>
        </div>
        <button className="vintage-button flex items-center gap-2 bg-vintage-green hover:bg-vintage-green-dark ml-8">
          <Play size={18} />
          <span className="font-bold uppercase tracking-tight">Test Flavor</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-8">
          <HumorFlavorStepList flavorId={numericFlavorId} />
        </section>

        <aside className="space-y-6">
          <div className="vintage-border p-6 bg-vintage-cream-dark">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4 border-b border-vintage-gray/20 pb-2">
              Flavor Details
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4 font-typewriter text-sm">
              <div>
                <label className="block font-bold uppercase mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-transparent border-b border-vintage-gray/50 focus:border-vintage-blue-dark outline-none py-1"
                  placeholder="e.g. funny-sarcastic"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-transparent border border-vintage-gray/30 focus:border-vintage-blue-dark outline-none p-2 min-h-[100px]"
                  placeholder="What makes this flavor unique?"
                />
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="vintage-button w-full mt-4 text-xs uppercase font-bold flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="vintage-border p-6 bg-vintage-blue/20 plaid-pattern">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4">
              Helpful Hints
            </h3>
            <p className="font-typewriter text-xs text-vintage-gray/80 leading-relaxed italic">
              "A good flavor starts with a clear description of the image, followed by a witty observation."
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
