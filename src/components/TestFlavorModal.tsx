"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Loader2, Upload, Image as ImageIcon, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface TestFlavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  flavorId: number;
  flavorSlug: string;
}

type StepStatus = "idle" | "loading" | "success" | "error";

export function TestFlavorModal({ isOpen, onClose, flavorId, flavorSlug }: TestFlavorModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<{
    presigned: StepStatus;
    upload: StepStatus;
    register: StepStatus;
    generate: StepStatus;
  }>({
    presigned: "idle",
    upload: "idle",
    register: "idle",
    generate: "idle",
  });

  const supabase = createClient();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setCaptions([]);
      setError(null);
      setSteps({
        presigned: "idle",
        upload: "idle",
        register: "idle",
        generate: "idle",
      });
    }
  };

  const runTest = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setCaptions([]);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error("Authentication required. Please log in again.");

      const API_BASE = "https://api.almostcrackd.ai";

      // Step 1: Generate Presigned URL
      setSteps(s => ({ ...s, presigned: "loading" }));
      const presignedRes = await fetch(`${API_BASE}/pipeline/generate-presigned-url`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentType: file.type }),
      });
      
      if (!presignedRes.ok) throw new Error("Failed to generate upload URL.");
      const { presignedUrl, cdnUrl } = await presignedRes.json();
      setSteps(s => ({ ...s, presigned: "success" }));

      // Step 2: Upload Image Bytes
      setSteps(s => ({ ...s, upload: "loading" }));
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image bytes.");
      setSteps(s => ({ ...s, upload: "success" }));

      // Step 3: Register Image URL
      setSteps(s => ({ ...s, register: "loading" }));
      const registerRes = await fetch(`${API_BASE}/pipeline/upload-image-from-url`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
      });

      if (!registerRes.ok) throw new Error("Failed to register image in pipeline.");
      const { imageId } = await registerRes.json();
      setSteps(s => ({ ...s, register: "success" }));

      // Step 4: Generate Captions
      setSteps(s => ({ ...s, generate: "loading" }));
      const generateRes = await fetch(`${API_BASE}/pipeline/generate-captions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId, humorFlavorId: flavorId }),
      });

      if (!generateRes.ok) throw new Error("Failed to generate captions.");
      const result = await generateRes.json();
      setCaptions(result);
      setSteps(s => ({ ...s, generate: "success" }));

    } catch (err: any) {
      console.error("Test execution failed:", err);
      setError(err.message);
      // Mark current loading step as error
      setSteps(s => {
        const next = { ...s };
        if (next.presigned === "loading") next.presigned = "error";
        else if (next.upload === "loading") next.upload = "error";
        else if (next.register === "loading") next.register = "error";
        else if (next.generate === "loading") next.generate = "error";
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ label, status }: { label: string, status: StepStatus }) => (
    <div className="flex items-center gap-2 text-xs font-typewriter">
      {status === "idle" && <div className="w-4 h-4 border border-vintage-gray/30 rounded-full" />}
      {status === "loading" && <Loader2 size={16} className="animate-spin text-vintage-blue-dark" />}
      {status === "success" && <CheckCircle2 size={16} className="text-vintage-green-dark" />}
      {status === "error" && <AlertCircle size={16} className="text-vintage-pink-dark" />}
      <span className={`${status === "idle" ? "text-vintage-gray/40" : "text-vintage-gray"}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vintage-gray/40 backdrop-blur-sm overflow-y-auto">
      <div className="vintage-border bg-vintage-cream w-full max-w-4xl p-8 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-vintage-gray/60 hover:text-vintage-gray transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold font-typewriter uppercase tracking-widest text-vintage-gray mb-2">
          Flavor Lab: {flavorSlug}
        </h2>
        <p className="text-xs font-typewriter italic text-vintage-gray/60 mb-8 pb-4 border-b border-vintage-gray/10">
          Upload an image to test your prompt chain via the Crack'd API pipeline.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div 
              className={`vintage-border border-dashed aspect-video flex flex-col items-center justify-center relative overflow-hidden bg-vintage-cream-dark group transition-colors ${!file ? 'hover:bg-vintage-blue/5 cursor-pointer' : ''}`}
              onClick={() => !loading && document.getElementById('test-file-input')?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-6">
                  <ImageIcon size={48} className="mx-auto text-vintage-gray/20 mb-4 group-hover:text-vintage-blue/40 transition-colors" />
                  <p className="text-sm font-typewriter text-vintage-gray/50 italic">
                    Drag and drop or click to select image bytes
                  </p>
                </div>
              )}
              <input 
                id="test-file-input"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>

            <div className="vintage-border p-4 bg-vintage-blue/5 space-y-3">
              <h4 className="text-[10px] font-bold uppercase text-vintage-gray/60 border-b border-vintage-gray/10 pb-1 mb-3">
                Pipeline Status
              </h4>
              <StepIndicator label="Acquiring Transmittal Authorization" status={steps.presigned} />
              <StepIndicator label="Transferring Image Bytes" status={steps.upload} />
              <StepIndicator label="Registering Metadata in Archive" status={steps.register} />
              <StepIndicator label="Executing Flavor Extraction" status={steps.generate} />
            </div>

            <button
              onClick={runTest}
              disabled={!file || loading}
              className="vintage-button w-full bg-vintage-green hover:bg-vintage-green-dark disabled:opacity-50 flex items-center justify-center gap-3 py-3"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              <span className="font-bold uppercase tracking-wider">Execute Test Run</span>
            </button>

            {error && (
              <div className="p-4 bg-vintage-pink/10 border-2 border-vintage-pink-dark/20 text-vintage-pink-dark text-xs font-typewriter uppercase font-bold flex items-start gap-3">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </section>

          <section className="flex flex-col">
            <h3 className="font-bold font-typewriter text-vintage-gray uppercase mb-4 flex items-center gap-2">
              Results Output
            </h3>
            
            <div className="flex-1 vintage-border bg-white p-6 min-h-[400px] overflow-y-auto space-y-4 shadow-inner">
              {captions.length > 0 ? (
                captions.map((cap, i) => (
                  <div key={cap.id || i} className="p-4 bg-vintage-cream border border-vintage-gray/10 font-typewriter relative">
                    <span className="absolute -top-2 -left-2 w-5 h-5 bg-vintage-gray text-white text-[10px] flex items-center justify-center rounded-full">
                      {i + 1}
                    </span>
                    <p className="text-sm italic leading-relaxed text-vintage-gray">
                      "{cap.content}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <span className="font-typewriter text-4xl mb-4 font-bold tracking-tighter italic">NO DATA</span>
                  <p className="text-xs font-typewriter italic max-w-[200px]">
                    Waiting for pipeline execution results to be transcribed...
                  </p>
                </div>
              )}
            </div>
            
            <p className="mt-4 text-[10px] font-typewriter italic text-vintage-gray/40 text-right">
              Generated via REST API Service v1.0 • almostcrackd.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
