
import { useState, useEffect } from 'react';
import { Phase, generateChartData } from '@/utils/curveUtils';
import { createGlassTemplatePhases } from '@/utils/glassTemplateUtils';
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
  ovenType: string;
  chartData: any[];
}

interface UseCurveStateProps {
  initialPhases?: Phase[];
}

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
  const [ovenType, setOvenType] = useState<string>("t");
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

  const applyGlassTemplate = () => {
    if (!selectedGlassInfo) return;
    
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
