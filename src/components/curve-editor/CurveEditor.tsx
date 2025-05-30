
import React from 'react';
import { calculateTotalTime } from '@/utils/curveUtils';
import { useCurveState } from '@/hooks/useCurveState';
import CurveChart from './CurveChart';
import CurveTableView from './CurveTableView';
import PhaseControls from './PhaseControls';
import { toast } from '@/components/ui/use-toast';
import { Phase } from '@/utils/curveUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CurveEditorProps {
  initialPhases?: Phase[];
  templatePhases?: Phase[];
  onSave?: (phases: Phase[]) => void;
  isVersionMode?: boolean; // Changed from isTemplateMode to be clearer
}

const CurveEditor = ({ 
  initialPhases = [], 
  templatePhases = [],
  onSave, 
  isVersionMode = false // This is for version experiments, not template
}: CurveEditorProps) => {
  const curveState = useCurveState({ 
    initialPhases,
    templatePhases,
    isTemplateMode: false // Always false here - this is for version editing
  });
  
  const [activeTab, setActiveTab] = React.useState("curve");
  
  const handleSave = () => {
    if (onSave) {
      onSave(curveState.phases);
    }
    
    // Show success toast
    toast({
      title: isVersionMode ? "Version saved!" : "Curve saved!",
      description: isVersionMode 
        ? "Your experimental version has been saved successfully."
        : "Your firing curve has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">
            {isVersionMode ? "Version Experiment" : "Firing Curve"}
          </h3>
          <div className="text-sm text-muted-foreground">
            Total time: {calculateTotalTime(curveState.phases)} min
          </div>
        </div>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6 p-2 bg-white/50">
              <TabsTrigger value="curve" className="flex-1 text-lg py-3">Curve View</TabsTrigger>
              <TabsTrigger value="table" className="flex-1 text-lg py-3">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curve" className="mt-6">
              <CurveChart 
                phases={curveState.phases}
                roomTemp={curveState.roomTemp}
                templatePhases={templatePhases}
              />
            </TabsContent>
            
            <TabsContent value="table" className="mt-6">
              <CurveTableView 
                phases={curveState.phases}
                isTemplateMode={false}
                roomTemp={curveState.roomTemp}
              />
            </TabsContent>
          </Tabs>
          
          <PhaseControls 
            phases={curveState.phases}
            onUpdatePhase={curveState.updatePhase}
            onAddPhase={curveState.addPhase}
            onRemovePhase={curveState.removePhase}
          />
        </div>
      </div>
    </div>
  );
};

export default CurveEditor;
