
import React from 'react';
import { calculateTotalTime } from '@/utils/curveUtils';
import { useCurveState } from '@/hooks/useCurveState';
import GlassSettings from './GlassSettings';
import CurveEditorTabs from './CurveEditorTabs';
import { toast } from '@/components/ui/use-toast';
import { Phase } from '@/utils/curveUtils';

interface CurveEditorProps {
  initialPhases?: Phase[];
  onSave?: (phases: Phase[]) => void;
}

const CurveEditor = ({ initialPhases = [], onSave }: CurveEditorProps) => {
  const curveState = useCurveState({ initialPhases });
  
  const handleSave = () => {
    if (onSave) onSave(curveState.phases);
    
    // Show success toast
    toast({
      title: "Curve saved!",
      description: "Your firing curve has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Glass Selection and Parameters */}
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

      {/* Curve Editor */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Firing Curve</h3>
          <div className="text-sm text-muted-foreground">
            Total time: {calculateTotalTime(curveState.phases)} min
          </div>
        </div>
        
        <CurveEditorTabs
          activeTab={curveState.activeTab}
          setActiveTab={curveState.setActiveTab}
          chartData={curveState.chartData}
          selectedGlassInfo={curveState.selectedGlassInfo}
          phases={curveState.phases}
          updatePhase={curveState.updatePhase}
          addPhase={curveState.addPhase}
          removePhase={curveState.removePhase}
          handleSave={handleSave}
          ovenType={curveState.ovenType}
          setOvenType={curveState.setOvenType}
        />
      </div>
    </div>
  );
};

export default CurveEditor;
