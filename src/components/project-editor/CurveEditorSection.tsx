import React, { useState, useEffect } from "react";
import CurveVersionChart from "@/components/CurveVersionChart";
import CurveEditor from "@/components/curve-editor/CurveEditor";
import { useCurves } from "@/hooks/useCurves";
import { useVersionManager } from "@/components/curve-editor/VersionManager";
import { Phase } from "@/utils/curveUtils";

interface CurveEditorSectionProps {
  curveId: string;
  versions: any[];
  setVersions: (versions: any[]) => void;
  currentVersionId: string | null;
  setCurrentVersionId: (id: string) => void;
  currentVersionData: any;
  setCurrentVersionData: (data: any) => void;
  templateCurveData: any;
  numberToSemantic: (num: number) => string;
}

const CurveEditorSection = ({
  curveId,
  versions,
  setVersions,
  currentVersionId,
  setCurrentVersionId,
  currentVersionData,
  setCurrentVersionData,
  templateCurveData,
  numberToSemantic
}: CurveEditorSectionProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [notes, setNotes] = useState("");
  const [materials, setMaterials] = useState("");
  const [tags, setTags] = useState("");
  
  const { getCurveVersions, loadCurveVersion, saveCurveVersion, getNextVersionNumber } = useCurves();

  // Real-time version fetching with cleanup
  useEffect(() => {
    const fetchVersions = async () => {
      if (curveId) {
        try {
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
          
          console.log('Filtered versions:', filteredVersions);
          setVersions(filteredVersions);
        } catch (error) {
          console.error('Error fetching versions:', error);
        }
      }
    };

    // Initial fetch
    fetchVersions();

    // Set up polling for real-time updates
    const interval = setInterval(fetchVersions, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [curveId, getCurveVersions, setVersions]);

  // Update form fields when current version data changes
  useEffect(() => {
    if (currentVersionData?.version) {
      setNotes(currentVersionData.version.notes || "");
      setMaterials(currentVersionData.version.materials || "");
      setTags(currentVersionData.version.tags || "");
    }
  }, [currentVersionData]);

  // Create default curve state based on template or empty state
  const getDefaultCurveState = () => {
    if (templateCurveData?.phases) {
      console.log('Using template curve data with phases:', templateCurveData.phases);
      // Ensure velocity values are preserved from template
      const phasesWithVelocity = templateCurveData.phases.map((phase: any) => {
        console.log(`Template phase: targetTemp=${phase.targetTemp}, velocity=${phase.velocity}`);
        return {
          ...phase,
          velocity: phase.velocity // Explicitly preserve velocity from template
        };
      });
      
      return {
        selectedGlass: templateCurveData.settings?.selectedGlass || "Bullseye Opaleszent",
        roomTemp: templateCurveData.settings?.roomTemp || 20,
        glassLayers: templateCurveData.settings?.glassLayers || "1",
        glassRadius: templateCurveData.settings?.glassRadius || "10",
        firingType: templateCurveData.settings?.firingType || "f",
        topTempMinutes: templateCurveData.settings?.topTempMinutes || "10",
        ovenType: templateCurveData.settings?.ovenType || "t",
        phases: phasesWithVelocity
      };
    }
    
    // Default empty state
    return {
      selectedGlass: "Bullseye Opaleszent",
      roomTemp: 20,
      glassLayers: "1",
      glassRadius: "10",
      firingType: "f",
      topTempMinutes: "10",
      ovenType: "t",
      phases: []
    };
  };

  const curveState = currentVersionData ? {
    selectedGlass: currentVersionData.version?.selected_glass || "Bullseye Opaleszent",
    roomTemp: currentVersionData.version?.room_temp || 20,
    glassLayers: currentVersionData.version?.glass_layers || "1",
    glassRadius: currentVersionData.version?.glass_radius || "10",
    firingType: currentVersionData.version?.firing_type || "f",
    topTempMinutes: currentVersionData.version?.top_temp_minutes || "10",
    ovenType: currentVersionData.version?.oven_type || "t",
    phases: currentVersionData.phases ? currentVersionData.phases.map((phase: any) => {
      // Ensure velocity is preserved when loading from database
      console.log(`Loading phase from DB: targetTemp=${phase.target_temp}, velocity=${phase.velocity}`);
      return {
        id: phase.id,
        targetTemp: phase.target_temp,
        duration: phase.duration,
        holdTime: phase.hold_time,
        velocity: phase.velocity // Explicitly preserve velocity from database
      };
    }) : []
  } : getDefaultCurveState();

  // Debug logging for curve state
  useEffect(() => {
    console.log('CurveEditorSection - curveState phases:', curveState.phases);
  }, [curveState.phases]);

  const versionManager = useVersionManager({
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
  });

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

  const handleEditVersion = async (versionId: string) => {
    await handleVersionSelect(versionId);
    setShowEditor(true);
  };

  const handleDuplicateVersion = async () => {
    if (!currentVersionId || !currentVersionData) return;
    
    console.log('Duplicating version:', currentVersionId);
    
    try {
      // Get the current version number for branching logic
      const currentVersionNumber = currentVersionData.version.version_number;
      let nextVersionNumber;
      
      if (currentVersionNumber === 0 || currentVersionNumber === "Template") {
        // Creating first version from template
        nextVersionNumber = 1;
      } else {
        // Parse current version to create a new draft
        const versionStr = String(currentVersionNumber);
        const parts = versionStr.split('.');
        const major = parseInt(parts[0]) || 1;
        const minor = parseInt(parts[1]) || 0;
        
        // Create next draft version (increment minor version)
        nextVersionNumber = `${major}.${minor + 1}`;
      }
      
      // Prepare the curve state for the new version
      const newCurveState = {
        selectedGlass: currentVersionData.version.selected_glass,
        roomTemp: currentVersionData.version.room_temp,
        glassLayers: currentVersionData.version.glass_layers,
        glassRadius: currentVersionData.version.glass_radius,
        firingType: currentVersionData.version.firing_type,
        topTempMinutes: currentVersionData.version.top_temp_minutes,
        ovenType: currentVersionData.version.oven_type,
        notes: currentVersionData.version.notes || "",
        materials: currentVersionData.version.materials || "",
        tags: currentVersionData.version.tags || ""
      };
      
      // Create the duplicate version with correct arguments
      const newVersion = await saveCurveVersion(
        curveId,
        `Draft ${nextVersionNumber}`,
        newCurveState,
        currentVersionData.phases || []
      );
      
      if (newVersion) {
        // Refresh versions to show the new node
        const refreshedVersions = await getCurveVersions(curveId);
        const filteredVersions = refreshedVersions.filter(v => {
          const versionStr = String(v.version_number);
          return v.version_number === 0 || 
                 versionStr === "Template" || 
                 (typeof v.version_number === 'number' && 
                  v.version_number > 0 && 
                  v.name && 
                  v.name !== 'Version 1' && 
                  !v.name.startsWith('Version 1.0'));
        });
        setVersions(filteredVersions);
        
        // Load the new version
        const newVersionData = await loadCurveVersion(newVersion.id);
        if (newVersionData) {
          setCurrentVersionId(newVersion.id);
          setCurrentVersionData(newVersionData);
        }
      }
    } catch (error) {
      console.error('Error duplicating version:', error);
    }
  };

  const handleMoveForward = async () => {
    console.log('Moving version forward:', currentVersionId);
    // TODO: Implement move forward logic
  };

  return (
    <div className="space-y-6">
      {/* Version Flow Chart */}
      <CurveVersionChart
        versions={versions}
        currentVersionId={currentVersionId}
        onVersionSelect={handleVersionSelect}
        onEditVersion={handleEditVersion}
        onDuplicateVersion={handleDuplicateVersion}
        onMoveForward={handleMoveForward}
      />
      
      {/* Curve Editor - shown when editing a version */}
      {showEditor && currentVersionData && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Editing {currentVersionData.version?.version_number === 0 ? 'Template' : `Version ${currentVersionData.version?.version_number}`}
            </h3>
            <button
              onClick={() => setShowEditor(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Close Editor
            </button>
          </div>
          <CurveEditor
            initialPhases={curveState.phases}
            templatePhases={templateCurveData?.phases || []}
            onSave={versionManager.handleSave}
            isVersionMode={true}
          />
        </div>
      )}
    </div>
  );
};

export default CurveEditorSection;
