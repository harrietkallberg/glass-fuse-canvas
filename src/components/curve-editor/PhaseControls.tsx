
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phase } from '@/utils/curveUtils';

interface PhaseControlsProps {
  phases: Phase[];
  onUpdatePhase: (id: string, field: keyof Phase, value: number) => void;
  onAddPhase: () => void;
  onRemovePhase: (id: string) => void;
}

const PhaseControls = ({
  phases,
  onUpdatePhase,
  onAddPhase,
  onRemovePhase
}: PhaseControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Curve Phases</h4>
        <Button onClick={onAddPhase} variant="outline" size="sm">
          Add Phase
        </Button>
      </div>
      
      <div className="space-y-2">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex items-center gap-4 p-3 bg-white/50 rounded-lg">
            <span className="min-w-[80px] text-sm font-medium">Phase {index + 1}</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={phase.targetTemp}
                onChange={(e) => onUpdatePhase(phase.id, 'targetTemp', Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-sm"
                placeholder="Temp"
              />
              <span className="text-xs self-center">°C</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={phase.duration}
                onChange={(e) => onUpdatePhase(phase.id, 'duration', Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-sm"
                placeholder="Duration"
              />
              <span className="text-xs self-center">min</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={phase.holdTime}
                onChange={(e) => onUpdatePhase(phase.id, 'holdTime', Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-sm"
                placeholder="Hold"
              />
              <span className="text-xs self-center">min</span>
            </div>
            {phases.length > 1 && (
              <Button 
                onClick={() => onRemovePhase(phase.id)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseControls;
