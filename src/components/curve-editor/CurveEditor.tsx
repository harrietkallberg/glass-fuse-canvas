
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CurveChart from './CurveChart';
import PhaseControls from './PhaseControls';
import { Phase } from '@/utils/curveUtils';

interface CurveEditorProps {
  initialPhases: Phase[];
  onSave?: (phases: Phase[]) => void;
  isTemplateMode?: boolean;
  templatePhases?: Phase[];
}

const CurveEditor = ({ 
  initialPhases, 
  onSave, 
  isTemplateMode = false,
  templatePhases = []
}: CurveEditorProps) => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [roomTemp] = useState(20);

  useEffect(() => {
    setPhases(initialPhases);
  }, [initialPhases]);

  const addPhase = () => {
    const lastPhase = phases[phases.length - 1];
    const newPhase: Phase = {
      id: Date.now().toString(),
      targetTemp: lastPhase?.targetTemp || 700,
      duration: 30,
      holdTime: 10,
    };
    setPhases([...phases, newPhase]);
  };

  const removePhase = (id: string) => {
    if (phases.length <= 1) return;
    setPhases(phases.filter(phase => phase.id !== id));
  };

  const updatePhase = (id: string, field: keyof Phase, value: number) => {
    setPhases(
      phases.map(phase => 
        phase.id === id ? { ...phase, [field]: value } : phase
      )
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(phases);
    }
  };

  return (
    <div className="space-y-6">
      <CurveChart 
        phases={phases} 
        roomTemp={roomTemp}
        templatePhases={templatePhases}
        isTemplateMode={isTemplateMode}
      />
      
      <PhaseControls 
        phases={phases}
        onUpdatePhase={updatePhase}
        onAddPhase={addPhase}
        onRemovePhase={removePhase}
      />

      {onSave && (
        <div className="flex justify-center">
          <Button onClick={handleSave} className="px-6 py-2">
            Save Template
          </Button>
        </div>
      )}
    </div>
  );
};

export default CurveEditor;
