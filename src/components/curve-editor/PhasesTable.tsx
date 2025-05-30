
import React from 'react';

interface Phase {
  id: string;
  targetTemp: number;
  duration: number;
  holdTime: number;
  velocity?: number;
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
  showSlideSelector?: boolean;
  viewMode?: 'chart' | 'table';
  onViewModeChange?: (mode: 'chart' | 'table') => void;
  roomTemp?: number;
}

const PhasesTable = ({
  phases,
  selectedGlassInfo,
  showSlideSelector = false,
  viewMode = 'chart',
  onViewModeChange,
  roomTemp = 20
}: PhasesTableProps) => {
  // Extract annealing temperatures from the glass info
  const upperAnnealingTemp = selectedGlassInfo?.o_astemp;
  const lowerAnnealingTemp = selectedGlassInfo?.n_astemp;
  
  // Get velocity for display - ONLY use stored velocity from Python script calculations
  const getDisplayVelocity = (phase: Phase): number => {
    // ALWAYS and ONLY use the stored velocity from Python calculations
    // Never recalculate or use fallback logic
    return phase.velocity || 0;
  };
  
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
    
    if (isUpperAnnealing) return 'bg-purple-50';
    if (isLowerAnnealing) return 'bg-orange-50';
    return '';
  };
  
  return (
    <div className="space-y-4">
      {showSlideSelector && onViewModeChange && (
        <div className="flex justify-end mb-4">
          <div className="relative bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => onViewModeChange('chart')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'chart'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      )}

      {/* Only show the table when in table view mode or when no view mode selector */}
      {(viewMode === 'table' || !showSlideSelector) && (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
            <div>Phase</div>
            <div>Target Temp (°C)</div>
            <div>Rise Time (min)</div>
            <div>Hold Time (min)</div>
            <div>Velocity (°C/h)</div>
          </div>
          
          {/* Phase rows */}
          {phases.map((phase, index) => {
            const highlightClass = getHighlightColor(phase);
            const velocity = getDisplayVelocity(phase);
            
            return (
              <div 
                key={phase.id} 
                className={`grid grid-cols-5 gap-4 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${highlightClass} ${
                  isAnnealingPhase(phase) ? 'border-amber-300 border-2' : ''
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  Phase {index + 1}
                </div>
                
                <div className="text-sm text-gray-700">
                  {phase.targetTemp}°C
                </div>
                
                <div className="text-sm text-gray-700">
                  {phase.duration} min
                </div>
                
                <div className="text-sm text-gray-700">
                  {phase.holdTime} min
                </div>
                
                <div className="text-sm text-gray-700">
                  {velocity > 0 ? '+' : ''}{velocity}°C/h
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PhasesTable;
