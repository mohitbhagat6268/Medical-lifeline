import { CheckCircle2, Circle, Radio } from 'lucide-react';
import { MESH_STEPS } from '../../services/meshSimulator';

export default function SOSTimeline({ currentStepIndex, logs }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-base">Live Signal Delivery Timeline</h3>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emergency/10 text-emergency">
          Simulated Mesh Relay
        </span>
      </div>

      <ol className="space-y-4">
        {MESH_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          const logEntry = logs.find((l) => l.id === step.id);

          return (
            <li key={step.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : isActive ? (
                  <Radio className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-border-subtle" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${idx <= currentStepIndex ? 'text-text-main' : 'text-text-muted'}`}>
                    {step.label}
                  </p>
                  {logEntry && <span className="text-xs text-text-muted">{logEntry.timestamp}</span>}
                </div>
                <p className="text-xs text-text-muted">{step.node}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}