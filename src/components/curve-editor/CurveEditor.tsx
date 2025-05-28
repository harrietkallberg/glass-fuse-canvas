import React from 'react';
import { calculateTotalTime } from '@/utils/curveUtils';
import { useCurveState } from '@/hooks/useCurveState';
import GlassSettings from './GlassSettings';
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
  isTemplateMode?: boolean;
}

const CurveEditor = ({ 
  initialPhases = [], 
  templatePhases = [],
  onSave, 
  isTemplateMode = false 
}: CurveEditorProps) => {
  const curveState = useCurveState({ initialPhases });
  const [activeTab, setActiveTab] = React.useState("curve");
  
  const handleSave = () => {
    if (onSave) onSave(curveState.phases);
    
    // Show success toast
    toast({
      title: isTemplateMode ? "Template saved!" : "Curve saved!",
      description: isTemplateMode 
        ? "Your project template has been saved successfully."
        : "Your firing curve has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Glass Selection and Parameters - only show in template mode */}
      {isTemplateMode && (
        <GlassSettings 
          glassData={curveState.glassData}
          selectedGlass={curveState.selectedGlass}
          setSelectedGlass={curveState.setSelectedGlass}
          roomTemp={curveState.roomTemp}
          setRoomTemp={curveState.setRoomTemp}
          glassLayers={curveState.glassLayers}
          setGlassLayers={curveState.setGlassLayers}
          glassRadius={curveState.glassRadius}
          setGlassRadius={curveState.setGlassRadius}
          firingType={curveState.firingType}
          setFiringType={curveState.setFiringType}
          topTempMinutes={curveState.topTempMinutes}
          setTopTempMinutes={curveState.setTopTempMinutes}
          applyGlassTemplate={curveState.applyGlassTemplate}
          ovenType={curveState.ovenType}
          setOvenType={curveState.setOvenType}
        />
      )}

      {/* Template Mode: Simple Curve/Table View */}
      {isTemplateMode ? (
        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Template Curve</h3>
            <div className="text-sm text-muted-foreground">
              Total time: {calculateTotalTime(curveState.phases)} min
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6 p-2 bg-white/50">
              <TabsTrigger value="curve" className="flex-1 text-lg py-3">Curve View</TabsTrigger>
              <TabsTrigger value="table" className="flex-1 text-lg py-3">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curve" className="mt-6">
              <CurveChart 
                phases={curveState.phases}
                roomTemp={curveState.roomTemp}
              />
            </TabsContent>
            
            <TabsContent value="table" className="mt-6">
              <CurveTableView 
                phases={curveState.phases}
                isTemplateMode={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Non-template mode: Keep existing full functionality
        <div className="glass p-6 rounded-2xl">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Firing Curve</h3>
            <div className="text-sm text-muted-foreground">
              Total time: {calculateTotalTime(curveState.phases)} min
            </div>
          </div>
          
          <div className="space-y-6">
            <CurveChart 
              phases={curveState.phases}
              roomTemp={curveState.roomTemp}
              templatePhases={templatePhases}
            />
            
            <PhaseControls 
              phases={curveState.phases}
              onUpdatePhase={curveState.updatePhase}
              onAddPhase={curveState.addPhase}
              onRemovePhase={curveState.removePhase}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CurveEditor;
