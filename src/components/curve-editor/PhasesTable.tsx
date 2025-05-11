
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
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
}

const PhasesTable = ({
  phases,
  updatePhase,
  addPhase,
  removePhase,
  handleSave,
  ovenType,
  setOvenType
}: PhasesTableProps) => {
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
      
      {phases.map((phase, index) => (
        <div key={phase.id} className="grid grid-cols-4 gap-4 items-center">
          <div>Phase {index + 1}</div>
          
          <div>
            <Input
              type="number"
              value={phase.targetTemp}
              onChange={(e) => updatePhase(phase.id, 'targetTemp', parseInt(e.target.value) || 0)}
              className="h-9"
            />
          </div>
          
          <div>
            <Input
              type="number"
              value={phase.duration}
              onChange={(e) => updatePhase(phase.id, 'duration', parseInt(e.target.value) || 0)}
              className="h-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              value={phase.holdTime}
              onChange={(e) => updatePhase(phase.id, 'holdTime', parseInt(e.target.value) || 0)}
              className="h-9"
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
      ))}
      
      <div className="flex justify-start">
        <Button onClick={addPhase} variant="outline" className="gap-1">
          <Plus className="h-4 w-4" /> Add Phase
        </Button>
      </div>
    </div>
  );
};

export default PhasesTable;
