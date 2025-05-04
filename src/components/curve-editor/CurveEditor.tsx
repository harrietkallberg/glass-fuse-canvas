
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import glassData from '../../tables.json';
import GlassSettings from './GlassSettings';
import PhasesTable from './PhasesTable';
import CurveChart from './CurveChart';
import { Phase, generateChartData, calculateTotalTime } from '@/utils/curveUtils';

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
  const [selectedGlass, setSelectedGlass] = useState<string>(glassData.Glassorter[0].namn);
  const [roomTemp, setRoomTemp] = useState<number>(20);
  const [glassLayers, setGlassLayers] = useState<string>("1");
  const [glassRadius, setGlassRadius] = useState<string>("10");
  const [firingType, setFiringType] = useState<string>("f");
  const [topTempMinutes, setTopTempMinutes] = useState<string>("10");
  const [chartData, setChartData] = useState<any[]>([]);

  // Find selected glass info
  const selectedGlassInfo = glassData.Glassorter.find(glass => glass.namn === selectedGlass);

  useEffect(() => {
    const data = generateChartData(phases, roomTemp);
    setChartData(data);
  }, [phases, roomTemp]);

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

  // Apply template based on glass info
  const applyGlassTemplate = () => {
    if (!selectedGlassInfo) return;
    
    let toppTemp;
    
    // Select proper top temperature based on firing type
    if (firingType === "f") {
      toppTemp = Math.round((selectedGlassInfo.f_topptemp[0] + selectedGlassInfo.f_topptemp[1]) / 2);
    } else if (firingType === "s") {
      toppTemp = Math.round((selectedGlassInfo.s_topptemp[0] + selectedGlassInfo.s_topptemp[1]) / 2);
    } else {
      toppTemp = selectedGlassInfo.t_topptemp;
    }

    // Get matching table for the selected glass category and oven type
    const uppvarmningTable = glassData["Tider for uppvarmning"].find(
      item => item.kategori === selectedGlassInfo.kategori && item.ugn === "t"
    );
    
    const halltiderTable = glassData["Halltider"].find(
      item => item.kategori === selectedGlassInfo.kategori
    );
    
    const avspanningTable = glassData["Avspanningstider"].find(
      item => item.kategori === selectedGlassInfo.kategori
    );

    // Extract times from tables
    const getTimeFromTable = (table: any, radius: string, layers: string) => {
      const radiusRow = table.tabell.find((row: any) => radius in row);
      return radiusRow ? radiusRow[radius][layers] : 30; // Default to 30 if not found
    };

    const uppvarmningTime = uppvarmningTable ? 
      getTimeFromTable(uppvarmningTable, glassRadius, glassLayers) : 30;
    
    const halltiderTime = halltiderTable ? 
      getTimeFromTable(halltiderTable, glassRadius, glassLayers) : 20;
    
    const avspanningTime = avspanningTable ? 
      getTimeFromTable(avspanningTable, glassRadius, glassLayers) : 60;

    // Create phases based on the firing curve algorithm in the Python script
    const inledandeSmaltpunkt = glassData["Inledande_smaltpunkt"];
    const oAstemp = selectedGlassInfo.o_astemp;
    const nAstemp = selectedGlassInfo.n_astemp;

    // Parse the user-provided top temperature hold time
    const topTempHoldTime = parseInt(topTempMinutes) || 10;

    // Create the new phases
    const newPhases = [
      { 
        id: '1', 
        targetTemp: inledandeSmaltpunkt, 
        duration: uppvarmningTime, 
        holdTime: 0 
      },
      { 
        id: '2', 
        targetTemp: toppTemp, 
        duration: 15, // Fast rise to top temp
        holdTime: topTempHoldTime // User specified hold time
      },
      { 
        id: '3', 
        targetTemp: oAstemp, 
        duration: halltiderTime, 
        holdTime: 0 
      },
      { 
        id: '4', 
        targetTemp: nAstemp, 
        duration: avspanningTime, 
        holdTime: 0 
      },
      { 
        id: '5', 
        targetTemp: roomTemp, 
        duration: 60, // Slow cooling to room temp
        holdTime: 0 
      }
    ];
    
    setPhases(newPhases);
  };

  return (
    <div className="space-y-6">
      {/* Glass Selection and Parameters */}
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
      />

      {/* Curve Editor */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Firing Curve</h3>
          <div className="text-sm text-muted-foreground">
            Total time: {calculateTotalTime(phases)} min
          </div>
        </div>
        
        <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Visual Curve</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-0">
            <CurveChart chartData={chartData} selectedGlassInfo={selectedGlassInfo} />
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <PhasesTable 
              phases={phases}
              updatePhase={updatePhase}
              addPhase={addPhase}
              removePhase={removePhase}
              handleSave={handleSave}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurveEditor;
