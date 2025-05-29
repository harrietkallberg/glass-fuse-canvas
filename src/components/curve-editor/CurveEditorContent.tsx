
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhasesTable from './PhasesTable';
import CurveChart from './CurveChart';
import GlassSettings from './GlassSettings';
import PhaseControls from './PhaseControls';
import { Phase } from '@/utils/curveUtils';
import { createGlassTemplatePhases } from '@/utils/glassTemplateUtils';

interface CurveEditorContentProps {
  phases: Phase[];
  onUpdatePhase: (id: string, updatedPhase: Partial<Phase>) => void;
  onDeletePhase: (id: string) => void;
  onAddPhase: () => void;
  onSave: () => void;
  isTemplateMode: boolean;
  glassData: any;
  selectedGlass: string;
  setSelectedGlass: (value: string) => void;
  roomTemp: number;
  setRoomTemp: (value: number) => void;
  glassLayers: string;
  setGlassLayers: (value: string) => void;
  glassRadius: string;
  setGlassRadius: (value: string) => void;
  firingType: string;
  setFiringType: (value: string) => void;
  topTempMinutes: string;
  setTopTempMinutes: (value: string) => void;
  ovenType: string;
  setOvenType: (value: string) => void;
  onApplyGlassTemplate?: () => void;
  onSetPhases: (phases: Phase[]) => void;
}

const CurveEditorContent = ({
  phases,
  onUpdatePhase,
  onDeletePhase,
  onAddPhase,
  onSave,
  isTemplateMode,
  glassData,
  selectedGlass,
  setSelectedGlass,
  roomTemp,
  setRoomTemp,
  glassLayers,
  setGlassLayers,
  glassRadius,
  setGlassRadius,
  firingType,
  setFiringType,
  topTempMinutes,
  setTopTempMinutes,
  ovenType,
  setOvenType,
  onApplyGlassTemplate,
  onSetPhases,
}: CurveEditorContentProps) => {
  // Helper function to match PhaseControls expected signature
  const handleUpdatePhase = (id: string, field: keyof Phase, value: number) => {
    onUpdatePhase(id, { [field]: value });
  };

  // Helper function to match PhasesTable expected signature
  const handleUpdatePhaseTable = (id: string, field: keyof Phase, value: number) => {
    onUpdatePhase(id, { [field]: value });
  };

  const applyGlassTemplate = () => {
    if (!glassData || !selectedGlass) {
      console.log('Missing glass data or selected glass');
      return;
    }

    const selectedGlassInfo = glassData.Glassorter.find((glass: any) => glass.namn === selectedGlass);
    if (!selectedGlassInfo) {
      console.log('Selected glass not found in data');
      return;
    }

    const newPhases = createGlassTemplatePhases(
      selectedGlassInfo,
      glassData,
      firingType,
      ovenType,
      glassRadius,
      glassLayers,
      topTempMinutes,
      roomTemp
    );

    console.log('Generated glass curve phases:', newPhases);
    onSetPhases(newPhases);
    
    if (onApplyGlassTemplate) {
      onApplyGlassTemplate();
    }
  };

  return (
    <Tabs defaultValue="curve" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="curve">Curve</TabsTrigger>
        {isTemplateMode && <TabsTrigger value="glass">Glass Settings</TabsTrigger>}
      </TabsList>
      <TabsContent value="curve">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <CurveChart phases={phases} />
          </div>
          <div className="w-full">
            <PhasesTable 
              phases={phases} 
              updatePhase={handleUpdatePhaseTable} 
              addPhase={onAddPhase}
              removePhase={onDeletePhase}
              handleSave={onSave}
            />
            <PhaseControls 
              phases={phases}
              onUpdatePhase={handleUpdatePhase}
              onAddPhase={onAddPhase}
              onRemovePhase={onDeletePhase}
            />
            <Button onClick={onSave} className="mt-4">Save Curve</Button>
          </div>
        </div>
      </TabsContent>
      {isTemplateMode && (
        <TabsContent value="glass">
          <GlassSettings
            glassData={glassData}
            selectedGlass={selectedGlass}
            setSelectedGlass={setSelectedGlass}
            roomTemp={roomTemp}
            setRoomTemp={setRoomTemp}
            glassLayers={glassLayers}
            setGlassLayers={setGlassLayers}
            glassRadius={glassRadius}
            setGlassRadius={setGlassRadius}
            firingType={firingType}
            setFiringType={setFiringType}
            topTempMinutes={topTempMinutes}
            setTopTempMinutes={setTopTempMinutes}
            applyGlassTemplate={applyGlassTemplate}
            ovenType={ovenType}
            setOvenType={setOvenType}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default CurveEditorContent;
