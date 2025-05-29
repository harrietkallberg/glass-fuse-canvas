
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

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
  updatePhase,
  addPhase,
  removePhase,
  handleSave,
  ovenType,
  setOvenType,
  selectedGlassInfo
}: PhasesTableProps) => {
  const [confirmPhaseId, setConfirmPhaseId] = useState<string | null>(null);
  const [confirmField, setConfirmField] = useState<keyof Phase | null>(null);
  const [confirmValue, setConfirmValue] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
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
  
  // Handle temperature change with confirmation for annealing temps
  const handleTempChange = (id: string, value: number) => {
    const phase = phases.find(p => p.id === id);
    if (!phase) return;
    
    // Check if this phase is an annealing phase
    if (isAnnealingPhase(phase)) {
      setConfirmPhaseId(id);
      setConfirmField('targetTemp');
      setConfirmValue(value);
      setConfirmDialogOpen(true);
    } else {
      // If not an annealing phase, update directly
      updatePhase(id, 'targetTemp', value);
    }
  };
  
  // Confirm the temperature change
  const confirmTempChange = () => {
    if (confirmPhaseId && confirmField && confirmValue !== null) {
      updatePhase(confirmPhaseId, confirmField, confirmValue);
    }
    setConfirmDialogOpen(false);
    resetConfirmState();
  };
  
  // Cancel the temperature change
  const cancelTempChange = () => {
    setConfirmDialogOpen(false);
    resetConfirmState();
  };
  
  // Reset confirmation state
  const resetConfirmState = () => {
    setConfirmPhaseId(null);
    setConfirmField(null);
    setConfirmValue(null);
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
              <Input
                type="number"
                value={phase.targetTemp}
                onChange={(e) => handleTempChange(phase.id, parseInt(e.target.value) || 0)}
                className={`h-9 text-base ${isAnnealingPhase(phase) ? 'border-2 border-amber-300' : ''}`}
              />
            </div>
            
            <div>
              <Input
                type="number"
                value={phase.duration}
                onChange={(e) => updatePhase(phase.id, 'duration', parseInt(e.target.value) || 0)}
                className="h-9 text-base"
              />
            </div>
            
            <div className="flex gap-2">
              <Input
                type="number"
                value={phase.holdTime}
                onChange={(e) => updatePhase(phase.id, 'holdTime', parseInt(e.target.value) || 0)}
                className="h-9 text-base"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removePhase(phase.id)}
                className="h-9 w-9"
                disabled={phases.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
      
      <div className="flex justify-start">
        <Button onClick={addPhase} variant="outline" className="gap-1 text-base">
          <Plus className="h-4 w-4" /> Add Phase
        </Button>
      </div>
      
      {/* Confirmation Dialog for Annealing Temperature Changes */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Modify Annealing Temperature?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You're changing a temperature that corresponds to an annealing point. 
              Modifying this value may affect the integrity of your glass project.
              
              {upperAnnealingTemp && confirmValue && Math.abs(confirmValue - upperAnnealingTemp) <= 30 && (
                <div className="mt-2">
                  Upper annealing point is {upperAnnealingTemp}°C.
                </div>
              )}
              
              {lowerAnnealingTemp && confirmValue && Math.abs(confirmValue - lowerAnnealingTemp) <= 30 && (
                <div className="mt-2">
                  Lower annealing point is {lowerAnnealingTemp}°C.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTempChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTempChange}>Confirm Change</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PhasesTable;
