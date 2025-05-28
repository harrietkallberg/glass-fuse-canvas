
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { useCurves } from '@/hooks/useCurves';
import { Phase, calculateTotalTime } from '@/utils/curveUtils';

interface VersionManagerProps {
  curveId: string;
  versions: any[];
  setVersions: (versions: any[]) => void;
  currentVersionId: string | null;
  setCurrentVersionId: (id: string) => void;
  setCurrentVersionData: (data: any) => void;
  curveState: any;
  notes: string;
  materials: string;
  tags: string;
  numberToSemantic: (num: number) => string;
}

export const useVersionManager = ({
  curveId,
  versions,
  setVersions,
  currentVersionId,
  setCurrentVersionId,
  setCurrentVersionData,
  curveState,
  notes,
  materials,
  tags,
  numberToSemantic
}: VersionManagerProps) => {
  const { 
    saveCurveVersion, 
    loadCurveVersion, 
    getCurveVersions,
  } = useCurves();

  const getNextPatchVersion = (currentVersion: string): string => {
    const parts = currentVersion.split('.');
    if (parts.length === 2) {
      return `${parts[0]}.${parts[1]}.1`;
    } else if (parts.length === 3) {
      const patch = parseInt(parts[2]) || 0;
      return `${parts[0]}.${parts[1]}.${patch + 1}`;
    } else if (parts.length === 4) {
      const subPatch = parseInt(parts[3]) || 0;
      return `${parts[0]}.${parts[1]}.${parts[2]}.${subPatch + 1}`;
    }
    return `${currentVersion}.1`;
  };

  const handleSave = async () => {
    try {
      // Generate patch version number
      const currentVersion = versions.find(v => v.id === currentVersionId);
      const currentVersionName = currentVersion ? numberToSemantic(currentVersion.version_number) : "1.0";
      const versionNumber = getNextPatchVersion(currentVersionName);

      // Save the curve version
      const savedVersion = await saveCurveVersion(
        curveId,
        `Version ${versionNumber}`,
        {
          selectedGlass: curveState.selectedGlass,
          roomTemp: curveState.roomTemp,
          glassLayers: curveState.glassLayers,
          glassRadius: curveState.glassRadius,
          firingType: curveState.firingType,
          topTempMinutes: curveState.topTempMinutes,
          ovenType: curveState.ovenType,
          notes,
          materials,
          tags,
        },
        curveState.phases
      );

      if (savedVersion) {
        setCurrentVersionId(savedVersion.id);
        
        // Refresh versions list
        const updatedVersions = await getCurveVersions(curveId);
        setVersions(updatedVersions);
        
        // Load the new version data
        const newVersionData = await loadCurveVersion(savedVersion.id);
        setCurrentVersionData(newVersionData);
        
        toast({
          title: "Changes saved!",
          description: `New version ${versionNumber} created successfully.`,
        });
      }
    } catch (error) {
      console.error('Error saving curve:', error);
      toast({
        title: "Error",
        description: "Failed to save curve",
        variant: "destructive"
      });
    }
  };

  const handleVersionSelect = async (versionId: string) => {
    if (!versionId || versionId === currentVersionId) return;
    
    const curveData = await loadCurveVersion(versionId);
    if (curveData) {
      setCurrentVersionId(versionId);
      setCurrentVersionData(curveData);
    }
  };

  const handleNewMainVersion = () => {
    const currentVersion = versions.find(v => v.id === currentVersionId);
    const currentVersionName = currentVersion ? numberToSemantic(currentVersion.version_number) : "1.0";
    const parts = currentVersionName.split('.');
    const major = parseInt(parts[0]) || 1;
    const newVersion = `${major + 1}.0`;
    
    toast({
      title: "New Main Version",
      description: `Ready to create version ${newVersion}. Save to create it.`,
    });
  };

  return {
    handleSave,
    handleVersionSelect,
    handleNewMainVersion
  };
};
