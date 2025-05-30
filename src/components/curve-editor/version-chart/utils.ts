
import { Version, NodePosition } from './types';

export const groupVersionsByGeneration = (versions: Version[]) => {
  return versions.reduce((acc, version) => {
    // Convert version_number to string first, then split
    const versionStr = String(version.version_number);
    const parts = versionStr.split('.');
    const generation = parseInt(parts[0]) || 1;
    const draft = parseInt(parts[1]) || 0;
    
    if (!acc[generation]) {
      acc[generation] = {};
    }
    if (!acc[generation][draft]) {
      acc[generation][draft] = [];
    }
    acc[generation][draft].push(version);
    return acc;
  }, {} as Record<number, Record<number, Version[]>>);
};

export const getNodePosition = (generation: number, draft: number, subIndex: number = 0): NodePosition => {
  const generationSpacing = 350; // Increased from 250
  const draftSpacing = 150; // Increased from 100
  const subSpacing = 80; // Increased from 60
  
  const baseX = 150 + (generation - 1) * generationSpacing; // Increased starting position
  const baseY = 150 + draft * draftSpacing; // Increased starting position
  
  return { 
    x: baseX + (subIndex * subSpacing), 
    y: baseY 
  };
};

export const getGenerationColor = (generation: number, isSelected: boolean, selectedVersionColor: string) => {
  const colors = ["#F97316", "#33C3F0", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
  return isSelected ? selectedVersionColor : colors[(generation - 1) % colors.length];
};
