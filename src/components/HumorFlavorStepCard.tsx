"use client";

import { HumorFlavorStep } from "@/types/database";
import { ChevronUp, ChevronDown, Trash2, Edit2, Settings } from "lucide-react";
import { useState } from "react";

interface HumorFlavorStepCardProps {
  step: HumorFlavorStep;
  index: number;
  totalSteps: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function HumorFlavorStepCard({
  step,
  index,
  totalSteps,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEdit,
}: HumorFlavorStepCardProps) {
  return (
    <div className="vintage-border bg-white p-6 relative group">
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-vintage-cream border-2 border-vintage-gray p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 hover:bg-vintage-blue/20 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === totalSteps - 1}
          className="p-1 hover:bg-vintage-blue/20 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-vintage-gray text-white flex items-center justify-center font-bold font-typewriter rounded-full">
            {index + 1}
          </div>
          <div>
            <h4 className="font-bold font-typewriter uppercase text-vintage-gray">
              {step.description || `Step ${index + 1}`}
            </h4>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-vintage-blue/30 border border-vintage-gray/20">
                {step.llm_models?.name || "Unknown Model"}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-vintage-yellow/30 border border-vintage-gray/20">
                {step.humor_flavor_step_types?.slug || "Unknown Type"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 border border-vintage-gray/20 hover:bg-vintage-blue/20 transition-colors"
          >
            <Edit2 size={14} className="text-vintage-gray" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 border border-vintage-gray/20 hover:bg-vintage-pink/20 transition-colors"
          >
            <Trash2 size={14} className="text-vintage-gray" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {step.llm_system_prompt && (
          <div>
            <span className="text-[10px] font-bold uppercase text-vintage-gray/50 block mb-1">
              System Prompt
            </span>
            <div className="text-xs font-typewriter bg-vintage-cream/50 p-3 border border-dashed border-vintage-gray/20 line-clamp-3">
              {step.llm_system_prompt}
            </div>
          </div>
        )}
        <div>
          <span className="text-[10px] font-bold uppercase text-vintage-gray/50 block mb-1">
            User Prompt
          </span>
          <div className="text-xs font-typewriter bg-vintage-cream/50 p-3 border border-dashed border-vintage-gray/20 line-clamp-3 italic">
            {step.llm_user_prompt || "No user prompt defined."}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-vintage-gray/10 flex justify-between items-center text-[10px] text-vintage-gray/40 font-typewriter">
        <span>Temp: {step.llm_temperature ?? "Default"}</span>
        <span>ID: {step.id}</span>
      </div>
    </div>
  );
}
