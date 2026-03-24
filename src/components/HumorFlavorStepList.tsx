"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { HumorFlavorStep } from "@/types/database";
import { HumorFlavorStepCard } from "./HumorFlavorStepCard";
import { HumorFlavorStepModal } from "./HumorFlavorStepModal";
import { Loader2, Plus, ArrowDown } from "lucide-react";

interface HumorFlavorStepListProps {
  flavorId: number;
}

export function HumorFlavorStepList({ flavorId }: HumorFlavorStepListProps) {
  const [steps, setSteps] = useState<HumorFlavorStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<HumorFlavorStep | null>(null);
  const supabase = createClient();

  const fetchSteps = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("humor_flavor_steps")
        .select(`
          *,
          humor_flavor_step_types ( slug ),
          llm_models ( name )
        `)
        .eq("humor_flavor_id", flavorId)
        .order("order_by", { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (err) {
      console.error("Error fetching steps:", err);
    } finally {
      setLoading(false);
    }
  }, [flavorId, supabase]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    // Swap order_by values
    const tempOrder = newSteps[index].order_by;
    newSteps[index].order_by = newSteps[targetIndex].order_by;
    newSteps[targetIndex].order_by = tempOrder;

    // Update locally for immediate feedback
    const swapped = [...newSteps];
    const [moved] = swapped.splice(index, 1);
    swapped.splice(targetIndex, 0, moved);
    setSteps(swapped);

    try {
      // Persist to DB
      await Promise.all([
        supabase.from("humor_flavor_steps").update({ order_by: newSteps[index].order_by }).eq("id", newSteps[index].id),
        supabase.from("humor_flavor_steps").update({ order_by: newSteps[targetIndex].order_by }).eq("id", newSteps[targetIndex].id)
      ]);
    } catch (err) {
      console.error("Error persisting reorder:", err);
      fetchSteps(); // Rollback on error
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this step from the chain?")) return;

    try {
      const { error } = await supabase.from("humor_flavor_steps").delete().eq("id", id);
      if (error) throw error;
      
      // Update other steps' order_by to close the gap? 
      // Actually, simple order_by works fine even with gaps, but let's just refresh.
      fetchSteps();
    } catch (err) {
      console.error("Error deleting step:", err);
    }
  };

  if (loading && steps.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center italic font-typewriter text-sm text-vintage-gray/40">
        <Loader2 className="animate-spin mb-2" />
        Synchronizing prompt chain...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-typewriter text-vintage-gray uppercase">
          Prompt Steps
        </h2>
        <button
          onClick={() => {
            setEditingStep(null);
            setIsModalOpen(true);
          }}
          className="vintage-button text-xs uppercase font-bold tracking-tight flex items-center gap-2"
        >
          <Plus size={16} />
          Add Step
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-vintage-cream/50 border-2 border-dashed border-vintage-gray/20">
          <p className="font-typewriter text-sm text-vintage-gray/60 italic mb-6">
            This flavor currently has no steps defined.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="vintage-button text-xs uppercase font-bold"
          >
            Create First Step
          </button>
        </div>
      ) : (
        <div className="space-y-8 relative">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative">
              <HumorFlavorStepCard
                step={step}
                index={idx}
                totalSteps={steps.length}
                onMoveUp={() => handleMove(idx, "up")}
                onMoveDown={() => handleMove(idx, "down")}
                onDelete={() => handleDelete(step.id)}
                onEdit={() => {
                  setEditingStep(step);
                  setIsModalOpen(true);
                }}
              />
              {idx < steps.length - 1 && (
                <div className="flex justify-center my-2 h-8">
                  <div className="w-0.5 bg-vintage-gray/20 relative">
                    <ArrowDown size={16} className="absolute -bottom-2 -left-[7px] text-vintage-gray/20" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <HumorFlavorStepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSteps}
        flavorId={flavorId}
        step={editingStep}
        nextOrder={steps.length > 0 ? Math.max(...steps.map(s => s.order_by)) + 1 : 1}
      />
    </div>
  );
}
