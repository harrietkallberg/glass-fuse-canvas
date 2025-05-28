
import { useState, useEffect } from 'react';
import { Phase, generateChartData } from '@/utils/curveUtils';
import glassData from '../tables.json';

export interface CurveState {
  phases: Phase[];
  activeTab: string;
  selectedGlass: string;
  roomTemp: number;
  glassLayers: string;
  glassRadius: string;
  firingType: string;
  topTempMinutes: string;
  ovenType: string; // Added oven type
  chartData: any[];
}

interface UseCurveStateProps {
  initialPhases?: Phase[];
}

// Helper function to calculate duration based on velocity (matching Python's _calculateTime)
const calculatePhaseDuration = (startTemp: number, endTemp: number, velocity: number, holdTime: number): number => {
  if (velocity === 0) {
    return holdTime;
  } else {
    return Math.ceil(Math.abs((endTemp - startTemp) / (velocity / 60)) + holdTime);
  }
};

export const useCurveState = ({ initialPhases = [] }: UseCurveStateProps) => {
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
  const [ovenType, setOvenType] = useState<string>("t"); // Default to "t" (top heated in Swedish)
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

  // Apply template based on glass info - matching Python's firing_curve_creator logic exactly
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
      item => item.kategori === selectedGlassInfo.kategori && item.ugn === ovenType
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

    // Create phases based on the firing curve algorithm - EXACTLY like Python
    const inledandeSmaltpunkt = glassData["Inledande_smaltpunkt"];
    const oAstemp = selectedGlassInfo.o_astemp;
    const nAstemp = selectedGlassInfo.n_astemp;

    // Parse the user-provided top temperature hold time
    const topTempHoldTime = parseInt(topTempMinutes) || 10;

    // Calculate velocities EXACTLY like in Python code using Math.trunc
    const firstHeatingVelocity = Math.trunc(60 * (inledandeSmaltpunkt - roomTemp) / uppvarmningTime) >= 999 
      ? 999 
      : Math.trunc(60 * (inledandeSmaltpunkt - roomTemp) / uppvarmningTime);
    const secondHeatingVelocity = 999; // Very high velocity to top temp
    const firstCoolingVelocity = Math.trunc(60 * (oAstemp - toppTemp) / halltiderTime);
    const secondCoolingVelocity = Math.trunc(60 * (nAstemp - oAstemp) / avspanningTime);
    const lastCoolingVelocity = -20;

    // Calculate durations using the Python _calculateTime logic
    const phase1Duration = calculatePhaseDuration(roomTemp, inledandeSmaltpunkt, firstHeatingVelocity, 0);
    const phase2Duration = calculatePhaseDuration(inledandeSmaltpunkt, toppTemp, secondHeatingVelocity, topTempHoldTime);
    const phase3Duration = calculatePhaseDuration(toppTemp, oAstemp, Math.abs(firstCoolingVelocity), 0);
    const phase4Duration = calculatePhaseDuration(oAstemp, nAstemp, Math.abs(secondCoolingVelocity), 0);
    const phase5Duration = calculatePhaseDuration(nAstemp, roomTemp, Math.abs(lastCoolingVelocity), 0);

    // Create the new phases with calculated durations matching Python logic
    const newPhases = [
      { 
        id: '1', 
        targetTemp: inledandeSmaltpunkt, 
        duration: phase1Duration, 
        holdTime: 0 
      },
      { 
        id: '2', 
        targetTemp: toppTemp, 
        duration: phase2Duration,
        holdTime: topTempHoldTime 
      },
      { 
        id: '3', 
        targetTemp: oAstemp, 
        duration: phase3Duration, 
        holdTime: 0 
      },
      { 
        id: '4', 
        targetTemp: nAstemp, 
        duration: phase4Duration, 
        holdTime: 0 
      },
      { 
        id: '5', 
        targetTemp: roomTemp, 
        duration: phase5Duration,
        holdTime: 0 
      }
    ];
    
    console.log('Calculated velocities (matching Python):', {
      firstHeatingVelocity,
      secondHeatingVelocity,
      firstCoolingVelocity,
      secondCoolingVelocity,
      lastCoolingVelocity
    });
    
    console.log('Calculated durations (matching Python):', {
      phase1Duration,
      phase2Duration,
      phase3Duration,
      phase4Duration,
      phase5Duration
    });
    
    setPhases(newPhases);
  };

  return {
    phases,
    setPhases,
    activeTab,
    setActiveTab,
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
    chartData,
    selectedGlassInfo,
    addPhase,
    removePhase,
    updatePhase,
    applyGlassTemplate,
    glassData
  };
};
