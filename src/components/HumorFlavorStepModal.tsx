"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { HumorFlavorStep, LLMModel, HumorFlavorStepType, LLMInputType, LLMOutputType } from "@/types/database";
import { X, Loader2, Save } from "lucide-react";

interface HumorFlavorStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flavorId: number;
  step?: HumorFlavorStep | null;
  nextOrder: number;
}

export function HumorFlavorStepModal({
  isOpen,
  onClose,
  onSuccess,
  flavorId,
  step,
  nextOrder,
}: HumorFlavorStepModalProps) {
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [models, setModels] = useState<LLMModel[]>([]);
  const [stepTypes, setStepTypes] = useState<HumorFlavorStepType[]>([]);
  const [inputTypes, setInputTypes] = useState<LLMInputType[]>([]);
  const [outputTypes, setOutputTypes] = useState<LLMOutputType[]>([]);

  const [formData, setFormData] = useState({
    description: "",
    llm_model_id: "",
    humor_flavor_step_type_id: "",
    llm_input_type_id: "",
    llm_output_type_id: "",
    llm_system_prompt: "",
    llm_user_prompt: "",
    llm_temperature: "0.7",
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const [modelsRes, stepTypesRes, inputTypesRes, outputTypesRes] = await Promise.all([
          supabase.from("llm_models").select("*"),
          supabase.from("humor_flavor_step_types").select("*"),
          supabase.from("llm_input_types").select("*"),
          supabase.from("llm_output_types").select("*"),
        ]);

        setModels(modelsRes.data || []);
        setStepTypes(stepTypesRes.data || []);
        setInputTypes(inputTypesRes.data || []);
        setOutputTypes(outputTypesRes.data || []);
      } catch (err) {
        console.error("Error fetching metadata:", err);
      } finally {
        setMetaLoading(false);
      }
    }

    if (isOpen) {
      fetchMetadata();
    }
  }, [isOpen, supabase]);

  useEffect(() => {
    if (step) {
      setFormData({
        description: step.description || "",
        llm_model_id: step.llm_model_id.toString(),
        humor_flavor_step_type_id: step.humor_flavor_step_type_id.toString(),
        llm_input_type_id: step.llm_input_type_id.toString(),
        llm_output_type_id: step.llm_output_type_id.toString(),
        llm_system_prompt: step.llm_system_prompt || "",
        llm_user_prompt: step.llm_user_prompt || "",
        llm_temperature: step.llm_temperature?.toString() || "0.7",
      });
    } else {
      setFormData({
        description: "",
        llm_model_id: models[0]?.id.toString() || "",
        humor_flavor_step_type_id: stepTypes[0]?.id.toString() || "",
        llm_input_type_id: inputTypes[0]?.id.toString() || "",
        llm_output_type_id: outputTypes[0]?.id.toString() || "",
        llm_system_prompt: "",
        llm_user_prompt: "",
        llm_temperature: "0.7",
      });
    }
  }, [step, models, stepTypes, inputTypes, outputTypes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      humor_flavor_id: flavorId,
      description: formData.description,
      llm_model_id: parseInt(formData.llm_model_id),
      humor_flavor_step_type_id: parseInt(formData.humor_flavor_step_type_id),
      llm_input_type_id: parseInt(formData.llm_input_type_id),
      llm_output_type_id: parseInt(formData.llm_output_type_id),
      llm_system_prompt: formData.llm_system_prompt,
      llm_user_prompt: formData.llm_user_prompt,
      llm_temperature: parseFloat(formData.llm_temperature),
      order_by: step ? step.order_by : nextOrder,
      modified_datetime_utc: new Date().toISOString(),
    };

    try {
      if (step) {
        const { error } = await supabase
          .from("humor_flavor_steps")
          .update(payload)
          .eq("id", step.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("humor_flavor_steps")
          .insert([payload]);
        if (error) throw error;
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Error saving step: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vintage-gray/40 backdrop-blur-sm overflow-y-auto">
      <div className="vintage-border bg-vintage-cream w-full max-w-2xl p-8 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-vintage-gray/60 hover:text-vintage-gray transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray mb-6">
          {step ? "Edit Step" : "Add Step"}
        </h2>

        {metaLoading ? (
          <div className="py-20 flex flex-col items-center justify-center italic font-typewriter text-sm">
            <Loader2 className="animate-spin mb-2" />
            Loading system archives...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 font-typewriter">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                  Step Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Initial Image Scan"
                  className="w-full bg-transparent border-b-2 border-vintage-gray/30 focus:border-vintage-blue-dark outline-none py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                  LLM Model
                </label>
                <select
                  required
                  value={formData.llm_model_id}
                  onChange={(e) => setFormData({ ...formData, llm_model_id: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-vintage-gray/30 focus:border-vintage-blue-dark outline-none py-2 text-sm appearance-none"
                >
                  <option value="">Select a model</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                  Step Type
                </label>
                <select
                  required
                  value={formData.humor_flavor_step_type_id}
                  onChange={(e) => setFormData({ ...formData, humor_flavor_step_type_id: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-vintage-gray/30 focus:border-vintage-blue-dark outline-none py-2 text-sm appearance-none"
                >
                  <option value="">Select type</option>
                  {stepTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.slug}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                  Input Type
                </label>
                <select
                  required
                  value={formData.llm_input_type_id}
                  onChange={(e) => setFormData({ ...formData, llm_input_type_id: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-vintage-gray/30 focus:border-vintage-blue-dark outline-none py-2 text-sm appearance-none"
                >
                  <option value="">Select input</option>
                  {inputTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.slug}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                  Output Type
                </label>
                <select
                  required
                  value={formData.llm_output_type_id}
                  onChange={(e) => setFormData({ ...formData, llm_output_type_id: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-vintage-gray/30 focus:border-vintage-blue-dark outline-none py-2 text-sm appearance-none"
                >
                  <option value="">Select output</option>
                  {outputTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.slug}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                System Prompt
              </label>
              <textarea
                value={formData.llm_system_prompt}
                onChange={(e) => setFormData({ ...formData, llm_system_prompt: e.target.value })}
                placeholder="Persona and guidelines for the LLM..."
                className="w-full bg-transparent border-2 border-vintage-gray/20 focus:border-vintage-blue-dark outline-none p-3 text-sm min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                User Prompt
              </label>
              <textarea
                required
                value={formData.llm_user_prompt}
                onChange={(e) => setFormData({ ...formData, llm_user_prompt: e.target.value })}
                placeholder="Specific instructions for this step..."
                className="w-full bg-transparent border-2 border-vintage-gray/20 focus:border-vintage-blue-dark outline-none p-3 text-sm min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-vintage-gray/70">
                Temperature ({formData.llm_temperature})
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={formData.llm_temperature}
                onChange={(e) => setFormData({ ...formData, llm_temperature: e.target.value })}
                className="w-full accent-vintage-blue-dark"
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
                className="flex-1 vintage-button bg-vintage-green hover:bg-vintage-green-dark disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span className="font-bold uppercase text-xs">Commit Step</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
