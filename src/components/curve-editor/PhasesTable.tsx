
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Phase {
  id: string;
  targetTemp: number;
  duration: number;
  holdTime: number;
}

interface PhasesTableProps {
  phases: Phase[];
  updatePhase: (id: string, field: keyof Phase, value: number) => void;
  addPhase: () => void;
  removePhase: (id: string) => void;
  handleSave: () => void;
  ovenType?: string;
  setOvenType?: (type: string) => void;
  selectedGlassInfo?: {
    o_astemp?: number;
    n_astemp?: number;
    [key: string]: any;
  };
}

const PhasesTable = ({
  phases,
  ovenType,
  setOvenType,
  selectedGlassInfo
}: PhasesTableProps) => {
  // Extract annealing temperatures from the glass info
  const upperAnnealingTemp = selectedGlassInfo?.o_astemp;
  const lowerAnnealingTemp = selectedGlassInfo?.n_astemp;
  
  // Check if a phase contains an annealing temperature
  const isAnnealingPhase = (phase: Phase) => {
    if (!upperAnnealingTemp && !lowerAnnealingTemp) return false;
    
    // Check if phase temp is within +/- 5°C of annealing temps
    const isUpperAnnealing = upperAnnealingTemp && 
      Math.abs(phase.targetTemp - upperAnnealingTemp) <= 5;
    
    const isLowerAnnealing = lowerAnnealingTemp && 
      Math.abs(phase.targetTemp - lowerAnnealingTemp) <= 5;
    
    return isUpperAnnealing || isLowerAnnealing;
  };
  
  // Get highlight color based on annealing type
  const getHighlightColor = (phase: Phase) => {
    if (!upperAnnealingTemp && !lowerAnnealingTemp) return '';
    
    const isUpperAnnealing = upperAnnealingTemp && 
      Math.abs(phase.targetTemp - upperAnnealingTemp) <= 5;
      
    const isLowerAnnealing = lowerAnnealingTemp && 
      Math.abs(phase.targetTemp - lowerAnnealingTemp) <= 5;
    
    if (isUpperAnnealing) return 'bg-purple-100/50';
    if (isLowerAnnealing) return 'bg-orange-100/50';
    return '';
  };
  
  return (
    <div className="space-y-4">
      {setOvenType && (
        <div className="mb-4">
          <label htmlFor="ovenType" className="block text-sm font-medium mb-1">
            Oven Type
          </label>
          <Select value={ovenType} onValueChange={setOvenType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select oven type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t">Top Heated (Toppvärme)</SelectItem>
              <SelectItem value="s">Side Heated (Sidovärme)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 px-2 py-2 bg-muted/30 rounded-lg">
        <div className="font-medium">Phase</div>
        <div className="font-medium">Target Temp (°C)</div>
        <div className="font-medium">Rise Time (min)</div>
        <div className="font-medium">Hold Time (min)</div>
      </div>
      
      {phases.map((phase, index) => {
        const highlightClass = getHighlightColor(phase);
        return (
          <div 
            key={phase.id} 
            className={`grid grid-cols-4 gap-4 items-center px-2 py-1 rounded-lg ${highlightClass}`}
          >
            <div className="text-base">Phase {index + 1}</div>
            
            <div>
              <div className={`h-9 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-base ${isAnnealingPhase(phase) ? 'border-2 border-amber-300' : ''}`}>
                {phase.targetTemp}°C
              </div>
            </div>
            
            <div>
              <div className="h-9 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-base">
                {phase.duration} min
              </div>
            </div>
            
            <div>
              <div className="h-9 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-base">
                {phase.holdTime} min
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhasesTable;
