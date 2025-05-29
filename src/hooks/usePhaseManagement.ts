
import { useState, useEffect } from 'react';
import { Phase } from '@/utils/curveUtils';

interface UsePhaseManagementProps {
  initialPhases: Phase[];
}

export const usePhaseManagement = ({ initialPhases }: UsePhaseManagementProps) => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);

  // Update phases when initialPhases change
  useEffect(() => {
    if (initialPhases && initialPhases.length > 0) {
      setPhases(initialPhases);
    }
  }, [initialPhases]);

  const addPhase = (newPhase: Phase) => {
    setPhases([...phases, { ...newPhase, id: String(Date.now()) }]);
  };

  const updatePhase = (id: string, updatedPhase: Partial<Phase>) => {
    setPhases(phases.map(phase => phase.id === id ? { ...phase, ...updatedPhase } : phase));
  };

  const deletePhase = (id: string) => {
    setPhases(phases.filter(phase => phase.id !== id));
  };

  const handleAddPhase = () => {
    const newPhase: Phase = {
      id: String(Date.now()),
      targetTemp: 100,
      duration: 30,
      holdTime: 0
    };
    addPhase(newPhase);
  };

  return {
    phases,
    setPhases,
    addPhase,
    updatePhase,
    deletePhase,
    handleAddPhase,
  };
};
