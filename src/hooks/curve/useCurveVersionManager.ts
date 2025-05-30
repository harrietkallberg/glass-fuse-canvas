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
  const { getCurveVersions, loadCurveVersion, saveCurveVersion, deleteVersion } = useCurves();

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
    if (!currentVersionData || !currentVersionData.version) {
      console.error('Invalid version data for duplication');
      return;
    }

    try {
      // Get the current version number and increment it
      const currentVersionNumber = currentVersionData.version.version_number;
      const newVersionNumber = currentVersionNumber + 1;
      const versionName = `Version ${numberToSemantic(newVersionNumber)}`;

      console.log('Duplicating version:', {
        currentVersionNumber,
        newVersionNumber,
        versionName
      });

      // Create new curve state with current settings
      const newCurveState = {
        selectedGlass: currentVersionData.version.selected_glass,
        roomTemp: currentVersionData.version.room_temp,
        glassLayers: currentVersionData.version.glass_layers,
        glassRadius: currentVersionData.version.glass_radius,
        firingType: currentVersionData.version.firing_type,
        topTempMinutes: currentVersionData.version.top_temp_minutes,
        ovenType: currentVersionData.version.oven_type,
        notes: currentVersionData.version.notes || '',
        materials: currentVersionData.version.materials || '',
        tags: currentVersionData.version.tags || '',
      };

      // Create the duplicate version with properly mapped phase data
      const newVersionPhases = currentVersionData.phases ? currentVersionData.phases.map((phase: any) => {
        // Ensure all values are numbers and have default values
        const targetTemp = Number(phase.targetTemp) || 0;
        const duration = Number(phase.duration) || 0;
        const holdTime = Number(phase.holdTime) || 0;
        const velocity = Number(phase.velocity) || 0;

        console.log('Mapping phase for duplication:', {
          targetTemp,
          duration,
          holdTime,
          velocity
        });

        return {
          targetTemp,
          duration,
          holdTime,
          velocity
        };
      }) : [];
      
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
        console.error('Failed to create new version - saveCurveVersion returned null');
        toast({
          title: "Error",
          description: "Failed to create new version - please check the console for details",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error duplicating version:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate version - please check the console for details",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!versionId) {
      console.error('No version ID provided for deletion');
      return;
    }

    try {
      // Don't allow deleting the template version
      const versionToDelete = versions.find(v => v.id === versionId);
      if (!versionToDelete) {
        console.error('Version not found:', versionId);
        toast({
          title: "Error",
          description: "Version not found",
          variant: "destructive"
        });
        return;
      }

      if (versionToDelete.version_number === 0 || String(versionToDelete.version_number) === "Template") {
        toast({
          title: "Cannot Delete Template",
          description: "The template version cannot be deleted.",
          variant: "destructive"
        });
        return;
      }

      console.log('Attempting to delete version:', versionToDelete);

      // Delete the version
      const success = await deleteVersion(versionId);
      
      if (!success) {
        throw new Error('Delete operation returned false');
      }
      
      // Refresh versions list
      const updatedVersions = await getCurveVersions(curveId);
      console.log('Updated versions after deletion:', updatedVersions);
      setVersions(updatedVersions);
      
      // If the deleted version was the current one, select another version
      if (versionId === currentVersionId) {
        const templateVersion = updatedVersions.find(v => v.version_number === 0 || String(v.version_number) === "Template");
        if (templateVersion) {
          console.log('Loading template version after deletion:', templateVersion);
          const curveData = await loadCurveVersion(templateVersion.id);
          if (curveData) {
            setCurrentVersionId(templateVersion.id);
            setCurrentVersionData(curveData);
          }
        }
      }
      
      toast({
        title: "Version Deleted",
        description: "The version has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting version:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete version - please check the console for details",
        variant: "destructive"
      });
    }
  };

  return {
    handleVersionSelect,
    handleDuplicateVersion,
    handleDeleteVersion
  };
};
