"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ROTATING_PLACEHOLDERS } from "@/lib/disclaimers";
import ExampleVibeChips from "./ExampleVibeChips";

interface VibeInputProps {
  onSubmit: (vibe: string) => void;
  loading?: boolean;
}

export default function VibeInput({ onSubmit, loading = false }: VibeInputProps) {
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(() => {
    if (value.trim() && !loading) onSubmit(value.trim());
  }, [value, loading, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipSelect = (vibe: string) => {
    setValue(vibe);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
          rows={3}
          className="w-full px-5 py-4 text-lg bg-white border-2 border-slate-200 rounded-2xl resize-none focus:outline-none focus:border-indigo-400 transition-colors placeholder-slate-400 shadow-sm"
          disabled={loading}
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-300 select-none">
          ⌘↵ to submit
        </div>
      </div>

      <p className="text-sm text-slate-400 text-center">
        No finance jargon needed. Just describe what you think is happening.
      </p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
          className="btn-primary min-w-[180px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exploring…
            </span>
          ) : (
            "Explore this vibe"
          )}
        </button>
        <button
          onClick={() => {
            const example =
              ROTATING_PLACEHOLDERS[Math.floor(Math.random() * ROTATING_PLACEHOLDERS.length)];
            setValue(example);
            textareaRef.current?.focus();
          }}
          disabled={loading}
          className="btn-secondary"
        >
          Try an example
        </button>
      </div>

      <div className="pt-2">
        <p className="text-xs text-slate-400 text-center mb-3">Or try one of these:</p>
        <ExampleVibeChips onSelect={handleChipSelect} />
      </div>
    </div>
  );
}
