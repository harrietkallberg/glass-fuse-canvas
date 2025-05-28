
import React from 'react';
import { calculateTotalTime } from '@/utils/curveUtils';
import { useCurveState } from '@/hooks/useCurveState';
import GlassSettings from './GlassSettings';
import CurveEditorTabs from './CurveEditorTabs';
import { toast } from '@/components/ui/use-toast';
import { Phase } from '@/utils/curveUtils';

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

      {/* Curve Editor */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">
            {isTemplateMode ? "Template Curve" : "Firing Curve"}
          </h3>
          <div className="text-sm text-muted-foreground">
            Total time: {calculateTotalTime(curveState.phases)} min
          </div>
        </div>
        
        <CurveEditorTabs
          activeTab={curveState.activeTab}
          setActiveTab={curveState.setActiveTab}
          phases={curveState.phases}
          templatePhases={templatePhases}
          roomTemp={curveState.roomTemp}
          currentVersionName="1.0"
          onUpdatePhase={curveState.updatePhase}
          onAddPhase={curveState.addPhase}
          onRemovePhase={curveState.removePhase}
          notes=""
          setNotes={() => {}}
          materials=""
          setMaterials={() => {}}
          tags=""
          setTags={() => {}}
        />
      </div>
    </div>
  );
};

export default CurveEditor;
