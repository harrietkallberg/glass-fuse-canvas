
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhasesTable from './PhasesTable';
import CurveChart from './CurveChart';
import GlassSettings from './GlassSettings';
import PhaseControls from './PhaseControls';
import { Phase } from '@/utils/curveUtils';
import { createGlassTemplatePhases } from '@/utils/glassTemplateUtils';

interface CurveEditorProps {
  initialPhases?: Phase[];
  onSave?: (phases: Phase[]) => void;
  isTemplateMode?: boolean;
  onApplyGlassTemplate?: () => void;
  savedSettings?: {
    selectedGlass?: string;
    roomTemp?: number;
    glassLayers?: string;
    glassRadius?: string;
    firingType?: string;
    topTempMinutes?: string;
    ovenType?: string;
  };
}

const CurveEditor = ({ 
  initialPhases = [], 
  onSave, 
  isTemplateMode = false, 
  onApplyGlassTemplate,
  savedSettings = {}
}: CurveEditorProps) => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  
  // Glass settings state - initialize with saved settings
  const [selectedGlass, setSelectedGlass] = useState(savedSettings.selectedGlass || '');
  const [roomTemp, setRoomTemp] = useState(savedSettings.roomTemp || 20);
  const [glassLayers, setGlassLayers] = useState(savedSettings.glassLayers || '1');
  const [glassRadius, setGlassRadius] = useState(savedSettings.glassRadius || '10');
  const [firingType, setFiringType] = useState(savedSettings.firingType || 'f');
  const [topTempMinutes, setTopTempMinutes] = useState(savedSettings.topTempMinutes || '10');
  const [ovenType, setOvenType] = useState(savedSettings.ovenType || 't');

  const [glassData, setGlassData] = useState<any>(null);

  // Update phases when initialPhases change
  useEffect(() => {
    if (initialPhases && initialPhases.length > 0) {
      setPhases(initialPhases);
    }
  }, [initialPhases]);

  // Update settings when savedSettings change
  useEffect(() => {
    if (savedSettings) {
      console.log('Updating CurveEditor with saved settings:', savedSettings);
      setSelectedGlass(savedSettings.selectedGlass || '');
      setRoomTemp(savedSettings.roomTemp || 20);
      setGlassLayers(savedSettings.glassLayers || '1');
      setGlassRadius(savedSettings.glassRadius || '10');
      setFiringType(savedSettings.firingType || 'f');
      setTopTempMinutes(savedSettings.topTempMinutes || '10');
      setOvenType(savedSettings.ovenType || 't');
    }
  }, [savedSettings]);

  // Load glass data
  useEffect(() => {
    fetch('/tables.json')
      .then(response => response.json())
      .then(data => {
        setGlassData(data);
      })
      .catch(error => {
        console.error('Error loading glass data:', error);
      });
  }, []);

  const addPhase = (newPhase: Phase) => {
    setPhases([...phases, { ...newPhase, id: String(Date.now()) }]);
  };

  const updatePhase = (id: string, updatedPhase: Partial<Phase>) => {
    setPhases(phases.map(phase => phase.id === id ? { ...phase, ...updatedPhase } : phase));
  };

  const deletePhase = (id: string) => {
    setPhases(phases.filter(phase => phase.id !== id));
  };

  // Helper function to match PhaseControls expected signature
  const handleUpdatePhase = (id: string, field: keyof Phase, value: number) => {
    updatePhase(id, { [field]: value });
  };

  const handleAddPhase = () => {
    const newPhase: Phase = {
      id: String(Date.now()),
      targetTemp: 100,
      duration: 30,
      holdTime: 0
    };
    addPhase(newPhase);
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
    setPhases(newPhases);
    
    if (onApplyGlassTemplate) {
      onApplyGlassTemplate();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(phases);
    }
  };

  if (!glassData) {
    return <div>Loading glass data...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Curve Editor</CardTitle>
      </CardHeader>
      <CardContent>
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
                <PhasesTable phases={phases} updatePhase={updatePhase} deletePhase={deletePhase} />
                <PhaseControls 
                  phases={phases}
                  onUpdatePhase={handleUpdatePhase}
                  onAddPhase={handleAddPhase}
                  onRemovePhase={deletePhase}
                />
                <Button onClick={handleSave} className="mt-4">Save Curve</Button>
              </div>
            </div>
          </TabsContent>
          {isTemplateMode && (
            <TabsContent value="glass">
              {glassData && (
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
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CurveEditor;
