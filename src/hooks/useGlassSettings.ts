
import { useState, useEffect } from 'react';

interface UseGlassSettingsProps {
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

export const useGlassSettings = ({ savedSettings = {} }: UseGlassSettingsProps) => {
  const [selectedGlass, setSelectedGlass] = useState(savedSettings.selectedGlass || '');
  const [roomTemp, setRoomTemp] = useState(savedSettings.roomTemp || 20);
  const [glassLayers, setGlassLayers] = useState(savedSettings.glassLayers || '1');
  const [glassRadius, setGlassRadius] = useState(savedSettings.glassRadius || '10');
  const [firingType, setFiringType] = useState(savedSettings.firingType || 'f');
  const [topTempMinutes, setTopTempMinutes] = useState(savedSettings.topTempMinutes || '10');
  const [ovenType, setOvenType] = useState(savedSettings.ovenType || 't');

  // Update settings when savedSettings change
  useEffect(() => {
    if (savedSettings) {
      console.log('Updating glass settings:', savedSettings);
      setSelectedGlass(savedSettings.selectedGlass || '');
      setRoomTemp(savedSettings.roomTemp || 20);
      setGlassLayers(savedSettings.glassLayers || '1');
      setGlassRadius(savedSettings.glassRadius || '10');
      setFiringType(savedSettings.firingType || 'f');
      setTopTempMinutes(savedSettings.topTempMinutes || '10');
      setOvenType(savedSettings.ovenType || 't');
    }
  }, [savedSettings]);

  return {
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
  };
};
