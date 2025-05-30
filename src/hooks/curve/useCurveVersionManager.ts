
import { useState, useEffect } from "react";
import { useCurves } from "@/hooks/useCurves";
import { Phase } from "@/utils/curveUtils";
import { toast } from "@/components/ui/use-toast";

interface UseCurveVersionManagerProps {
  curveId: string;
  versions: any[];
  setVersions: (versions: any[]) => void;
  currentVersionId: string | null;
  setCurrentVersionId: (id: string) => void;
  setCurrentVersionData: (data: any) => void;
  numberToSemantic: (num: number) => string;
}

export const useCurveVersionManager = ({
  curveId,
  versions,
  setVersions,
  currentVersionId,
  setCurrentVersionId,
  setCurrentVersionData,
  numberToSemantic
}: UseCurveVersionManagerProps) => {
  const { getCurveVersions, loadCurveVersion, saveCurveVersion } = useCurves();

  // Real-time version fetching with optimized polling
  useEffect(() => {
    const fetchVersions = async () => {
      if (curveId) {
        try {
          console.log('useCurveVersionManager - Fetching versions for curve:', curveId);
          const latestVersions = await getCurveVersions(curveId);
          
          // Filter to only show template and properly created versions
          const filteredVersions = latestVersions.filter(v => {
            const versionStr = String(v.version_number);
            return v.version_number === 0 || // Template
                   versionStr === "Template" || 
                   (typeof v.version_number === 'number' && 
                    v.version_number > 0 && 
                    v.name && 
                    v.name !== 'Version 1' && // Exclude default auto-created versions
                    !v.name.startsWith('Version 1.0')); // Exclude auto-created versions
          });
          
          console.log('useCurveVersionManager - Filtered versions:', filteredVersions);
          setVersions(filteredVersions);
        } catch (error) {
          console.error('Error fetching versions:', error);
        }
      }
    };

    // Initial fetch
    fetchVersions();

    // Set up polling for real-time updates
    const interval = setInterval(fetchVersions, 2000); // Increased to 2 seconds to reduce load

    return () => clearInterval(interval);
  }, [curveId, getCurveVersions, setVersions]);

  const handleVersionSelect = async (versionId: string) => {
    if (!versionId || versionId === currentVersionId) return;
    
    try {
      const curveData = await loadCurveVersion(versionId);
      if (curveData) {
        setCurrentVersionId(versionId);
        setCurrentVersionData(curveData);
      }
    } catch (error) {
      console.error('Error loading version:', error);
    }
  };

  const getNextMinorVersion = (currentVersionNumber: number): string => {
    if (currentVersionNumber === 0) {
      // From template, create 0.1
      return "0.1";
    }
    
    // For existing versions, increment the minor version
    const semanticVersion = numberToSemantic(currentVersionNumber);
    const parts = semanticVersion.split('.');
    const major = parseInt(parts[0]) || 0;
    const minor = parseInt(parts[1]) || 0;
    
    // Increment minor version
    return `${major}.${minor + 1}`;
  };

  const handleDuplicateVersion = async (currentVersionData: any) => {
    if (!currentVersionId || !currentVersionData) {
      console.error('No current version selected for duplication');
      toast({
        title: "Error",
        description: "No version selected for duplication",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Duplicating version:', currentVersionId, currentVersionData);
    
    try {
      // Get the current version number and calculate next minor version
      const currentVersionNumber = currentVersionData.version.version_number;
      const nextVersionString = getNextMinorVersion(currentVersionNumber);
      const versionName = `Version ${nextVersionString}`;
      
      console.log(`Creating new version: ${versionName} from version number ${currentVersionNumber}`);
      
      // Prepare the curve state for the new version
      const newCurveState = {
        selectedGlass: currentVersionData.version.selected_glass || "Bullseye Opaleszent",
        roomTemp: currentVersionData.version.room_temp || 20,
        glassLayers: currentVersionData.version.glass_layers || "1",
        glassRadius: currentVersionData.version.glass_radius || "10",
        firingType: currentVersionData.version.firing_type || "f",
        topTempMinutes: currentVersionData.version.top_temp_minutes || "10",
        ovenType: currentVersionData.version.oven_type || "t",
        notes: currentVersionData.version.notes || "",
        materials: currentVersionData.version.materials || "",
        tags: currentVersionData.version.tags || ""
      };
      
      // Create the duplicate version with the exact same phases and velocities
      const newVersionPhases = currentVersionData.phases ? currentVersionData.phases.map((phase: any) => ({
        targetTemp: phase.target_temp || phase.targetTemp || 0,
        duration: phase.duration || 0,
        holdTime: phase.hold_time || phase.holdTime || 0,
        velocity: phase.velocity || 0
      })) : [];
      
      console.log('Creating new version with phases:', newVersionPhases);
      console.log('Creating new version with curve state:', newCurveState);
      
      const newVersion = await saveCurveVersion(
        curveId,
        versionName,
        newCurveState,
        newVersionPhases
      );
      
      if (newVersion) {
        console.log('Successfully created new version:', newVersion);
        
        toast({
          title: "Version Duplicated",
          description: `Successfully created ${versionName}`,
        });
        
        // Refresh versions immediately
        const updatedVersions = await getCurveVersions(curveId);
        setVersions(updatedVersions);
        
        // Load the new version after a short delay to ensure database consistency
        setTimeout(async () => {
          const newVersionData = await loadCurveVersion(newVersion.id);
          if (newVersionData) {
            setCurrentVersionId(newVersion.id);
            setCurrentVersionData(newVersionData);
          }
        }, 500);
      } else {
        console.error('Failed to create new version');
        toast({
          title: "Error",
          description: "Failed to create new version",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error duplicating version:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate version",
        variant: "destructive"
      });
    }
  };

  return {
    handleVersionSelect,
    handleDuplicateVersion
  };
};
