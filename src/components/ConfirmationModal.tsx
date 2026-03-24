"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm Action",
  cancelText = "Abeyance",
  isLoading = false,
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const accentColor = variant === "danger" ? "bg-vintage-pink-dark" : "bg-vintage-yellow-dark";
  const borderColor = variant === "danger" ? "border-vintage-pink-dark" : "border-vintage-yellow-dark";
  const textColor = variant === "danger" ? "text-vintage-pink-dark" : "text-vintage-yellow-dark";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-vintage-gray/60 backdrop-blur-sm">
      <div className="vintage-border bg-vintage-cream w-full max-w-md p-0 relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header Decor */}
        <div className={`h-2 w-full ${accentColor}`} />
        
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-full ${variant === "danger" ? "bg-vintage-pink/20" : "bg-vintage-yellow/20"}`}>
              <AlertTriangle className={textColor} size={24} />
            </div>
            <h2 className="text-xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray">
              {title}
            </h2>
          </div>

          <p className="text-sm font-typewriter text-vintage-gray/80 leading-relaxed mb-8 italic bg-vintage-cream-dark p-4 border border-dashed border-vintage-gray/20">
            "{message}"
          </p>

          <div className="flex gap-4 font-typewriter">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border-2 border-vintage-gray/20 text-xs font-bold uppercase hover:bg-vintage-gray/5 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 vintage-button flex items-center justify-center gap-2 ${
                variant === "danger" ? "bg-vintage-pink-dark hover:bg-vintage-pink" : "bg-vintage-yellow-dark hover:bg-vintage-yellow"
              } text-white disabled:opacity-50`}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              <span className="font-bold uppercase text-xs">{confirmText}</span>
            </button>
          </div>
        </div>

        {/* Footer Decor */}
        <div className="bg-vintage-blue/10 plaid-pattern h-8 border-t border-vintage-gray/10" />
      </div>
    </div>
  );
}
