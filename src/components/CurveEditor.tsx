
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';

interface Phase {
  id: string;
  targetTemp: number;
  duration: number;
  holdTime: number;
}

interface CurveEditorProps {
  initialPhases?: Phase[];
  onSave?: (phases: Phase[]) => void;
}

const CurveEditor = ({ initialPhases = [], onSave }: CurveEditorProps) => {
  const [phases, setPhases] = useState<Phase[]>(
    initialPhases.length > 0 
      ? initialPhases 
      : [{ id: '1', targetTemp: 700, duration: 30, holdTime: 10 }]
  );
  
  const [activeTab, setActiveTab] = useState('chart');

  const addPhase = () => {
    const lastPhase = phases[phases.length - 1];
    const newPhase = {
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
    if (onSave) onSave(phases);
  };

  const renderChart = () => {
    return (
      <div className="h-[300px] w-full bg-muted/30 rounded-lg relative flex items-center justify-center">
        <div className="absolute inset-0 p-4">
          <div className="h-full w-full relative">
            {/* Horizontal lines - temperature indicators */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <div 
                key={percent} 
                className="absolute w-full border-t border-muted-foreground/20"
                style={{ top: `${100 - percent}%` }}
              >
                <span className="absolute -left-6 -top-2 text-xs text-muted-foreground">
                  {Math.round((percent / 100) * 1000)}°C
                </span>
              </div>
            ))}
            
            {/* Draw the curve */}
            <svg className="h-full w-full">
              <path
                d={`
                  M 0,${300 - (phases[0].targetTemp / 1000) * 300} 
                  ${phases.map((phase, index) => {
                    const previousPhases = phases.slice(0, index);
                    const totalPreviousDuration = previousPhases.reduce(
                      (acc, p) => acc + p.duration + p.holdTime, 0
                    );
                    
                    const phaseStartX = (totalPreviousDuration / 200) * 100;
                    const phaseRiseEndX = phaseStartX + (phase.duration / 200) * 100;
                    const phaseEndX = phaseRiseEndX + (phase.holdTime / 200) * 100;
                    
                    const y = 300 - (phase.targetTemp / 1000) * 300;
                    
                    return `
                      L ${phaseRiseEndX}%,${y} 
                      L ${phaseEndX}%,${y}
                    `;
                  }).join(' ')}
                `}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            </svg>
            
            {/* Phase points */}
            {phases.map((phase, index) => {
              const previousPhases = phases.slice(0, index);
              const totalPreviousDuration = previousPhases.reduce(
                (acc, p) => acc + p.duration + p.holdTime, 0
              );
              
              const phaseStartX = (totalPreviousDuration / 200) * 100;
              const phaseRiseEndX = phaseStartX + (phase.duration / 200) * 100;
              const phaseEndX = phaseRiseEndX + (phase.holdTime / 200) * 100;
              
              const y = 300 - (phase.targetTemp / 1000) * 300;
              
              return (
                <React.Fragment key={phase.id}>
                  <div 
                    className="absolute h-2 w-2 bg-primary rounded-full transform -translate-x-1 -translate-y-1"
                    style={{ 
                      left: `${phaseRiseEndX}%`, 
                      top: `${(y / 300) * 100}%` 
                    }}
                  />
                  <div 
                    className="absolute h-2 w-2 bg-primary rounded-full transform -translate-x-1 -translate-y-1"
                    style={{ 
                      left: `${phaseEndX}%`, 
                      top: `${(y / 300) * 100}%` 
                    }}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {phases.length === 0 && (
          <p className="text-muted-foreground">Add phases to see the curve</p>
        )}
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div className="space-y-4">
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
        
        <div className="flex justify-between">
          <Button onClick={addPhase} variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Add Phase
          </Button>
          
          <Button onClick={handleSave} className="gap-1">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Visual Curve</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-0">
          {renderChart()}
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          {renderTable()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurveEditor;
