
import { Version, NodePosition } from './types';

export const groupVersionsByGeneration = (versions: Version[]) => {
  return versions.reduce((acc, version) => {
    const parts = version.version_number.split('.');
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

export const getNodePosition = (generation: number, draft: number, subIndex: number = 0, hasTemplate: boolean = false): NodePosition => {
  const generationSpacing = 350;
  const draftSpacing = 150;
  const subSpacing = 80;
  
  // Offset for template node if it exists
  const templateOffset = hasTemplate ? 200 : 0;
  const baseX = 150 + templateOffset + (generation - 1) * generationSpacing;
  const baseY = 150 + draft * draftSpacing;
  
  return { 
    x: baseX + (subIndex * subSpacing), 
    y: baseY 
  };
};

export const getGenerationColor = (generation: number, isSelected: boolean, selectedVersionColor: string) => {
  const colors = ["#F97316", "#33C3F0", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
  return isSelected ? selectedVersionColor : colors[(generation - 1) % colors.length];
};
