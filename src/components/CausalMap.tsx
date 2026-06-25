import type { CausalMapNode } from "@/types/vibe";

interface CausalMapProps {
  nodes: CausalMapNode[];
}

export default function CausalMap({ nodes }: CausalMapProps) {
  if (nodes.length === 0) return null;

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Vibe → Investment Map</h2>
      <p className="text-sm text-slate-500">
        The causal chain from your belief to potential investable areas.
      </p>
      <div className="space-y-1">
        {nodes.map((node, index) => (
          <div key={node.step}>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">
                {node.step}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{node.title}</p>
                <p className="text-sm text-slate-600">{node.description}</p>
              </div>
            </div>
            {index < nodes.length - 1 && (
              <div className="ml-6 pl-3 border-l-2 border-dashed border-slate-200 h-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
