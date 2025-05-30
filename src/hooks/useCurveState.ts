
import { useState, useEffect } from 'react';
import { Phase } from '@/utils/curveUtils';
import { createGlassTemplatePhases } from '@/utils/glassTemplateUtils';
import glassData from '@/tables.json';

interface UseCurveStateProps {
  initialPhases: Phase[];
  templatePhases?: Phase[];
  isTemplateMode?: boolean;
}

export const useCurveState = ({ initialPhases, templatePhases = [], isTemplateMode = false }: UseCurveStateProps) => {
  // Phase management
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  
  // Glass settings state - these represent the template configuration
  const [selectedGlass, setSelectedGlass] = useState<string>("Bullseye Opaleszent");
  const [roomTemp, setRoomTemp] = useState<number>(20);
  const [glassLayers, setGlassLayers] = useState<string>("1");
  const [glassRadius, setGlassRadius] = useState<string>("10");
  const [firingType, setFiringType] = useState<string>("f");
  const [topTempMinutes, setTopTempMinutes] = useState<string>("10");
  const [ovenType, setOvenType] = useState<string>("t");

  // Update phases when initialPhases change
  useEffect(() => {
    setPhases(initialPhases);
  }, [initialPhases]);

  // Phase operations that match PhaseControls expected signatures
  const updatePhase = (id: string, field: keyof Phase, value: number) => {
    setPhases(prev => prev.map(phase => 
      phase.id === id ? { ...phase, [field]: value } : phase
    ));
  };

  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      targetTemp: 20,
      duration: 60,
      holdTime: 0
    };
    setPhases(prev => [...prev, newPhase]);
  };

  const removePhase = (id: string) => {
    setPhases(prev => prev.filter(phase => phase.id !== id));
  };

  // Legacy functions for backward compatibility with other components
  const updatePhaseByIndex = (index: number, updatedPhase: Partial<Phase>) => {
    setPhases(prev => prev.map((phase, i) => 
      i === index ? { ...phase, ...updatedPhase } : phase
    ));
  };

  const addPhaseWithData = (newPhase: Phase) => {
    setPhases(prev => [...prev, newPhase]);
  };

  const removePhaseByIndex = (index: number) => {
    setPhases(prev => prev.filter((_, i) => i !== index));
  };

  // Template generation - creates the master recipe from glass parameters
  const generateTemplateFromSettings = () => {
    try {
      const selectedGlassInfo = glassData.Glassorter.find(glass => glass.namn === selectedGlass);
      if (!selectedGlassInfo) {
        throw new Error("Selected glass not found");
      }

      const templatePhases = createGlassTemplatePhases(
        selectedGlassInfo,
        glassData,
        firingType,
        ovenType,
        glassRadius,
        glassLayers,
        topTempMinutes,
        roomTemp
      );

      setPhases(templatePhases);
      return templatePhases;
    } catch (error) {
      console.error('Error generating template:', error);
      return null;
    }
  };

  // Get selected glass information
  const getSelectedGlassInfo = () => {
    return glassData.Glassorter.find(glass => glass.namn === selectedGlass);
  };

  // Load template settings into the state (for editing template)
  const loadTemplateSettings = (templateSettings: any) => {
    if (templateSettings) {
      setSelectedGlass(templateSettings.selectedGlass || "Bullseye Opaleszent");
      setRoomTemp(templateSettings.roomTemp || 20);
      setGlassLayers(templateSettings.glassLayers || "1");
      setGlassRadius(templateSettings.glassRadius || "10");
      setFiringType(templateSettings.firingType || "f");
      setTopTempMinutes(templateSettings.topTempMinutes || "10");
      setOvenType(templateSettings.ovenType || "t");
    }
  };

  // Get current template settings
  const getTemplateSettings = () => ({
    selectedGlass,
    roomTemp,
    glassLayers,
    glassRadius,
    firingType,
    topTempMinutes,
    ovenType
  });

  return {
    // Phase state and operations (new signatures)
    phases,
    setPhases,
    updatePhase,
    addPhase,
    removePhase,
    
    // Legacy phase operations (for backward compatibility)
    updatePhaseByIndex,
    addPhaseWithData,
    removePhaseByIndex,
    
    // Glass settings (template configuration)
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
    
    // Glass info property
    selectedGlassInfo: getSelectedGlassInfo(),
    
    // Template operations
    generateTemplateFromSettings,
    getSelectedGlassInfo,
    loadTemplateSettings,
    getTemplateSettings,
  };
};
