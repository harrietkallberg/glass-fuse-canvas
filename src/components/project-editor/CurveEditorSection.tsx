
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState<"chart" | "editor">("chart");
  const [notes, setNotes] = useState("");
  const [materials, setMaterials] = useState("");
  const [tags, setTags] = useState("");
  
  const { getCurveVersions, loadCurveVersion } = useCurves();

  // Real-time version fetching
  useEffect(() => {
    const fetchVersions = async () => {
      if (curveId) {
        try {
          const latestVersions = await getCurveVersions(curveId);
          // Filter out template versions that shouldn't be shown
          const filteredVersions = latestVersions.filter(v => 
            v.version_number === 0 || 
            v.version_number === "Template" || 
            v.version_number > 0
          );
          console.log('Fetched versions:', filteredVersions);
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
      return {
        selectedGlass: templateCurveData.settings?.selectedGlass || "Bullseye Opaleszent",
        roomTemp: templateCurveData.settings?.roomTemp || 20,
        glassLayers: templateCurveData.settings?.glassLayers || "1",
        glassRadius: templateCurveData.settings?.glassRadius || "10",
        firingType: templateCurveData.settings?.firingType || "f",
        topTempMinutes: templateCurveData.settings?.topTempMinutes || "10",
        ovenType: templateCurveData.settings?.ovenType || "t",
        phases: templateCurveData.phases
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
    phases: currentVersionData.phases || []
  } : getDefaultCurveState();

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

  const handleSetMainVersion = async (versionId: string) => {
    // Implementation for setting main version
    console.log('Setting main version:', versionId);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "chart" | "editor")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Version Flow</TabsTrigger>
          <TabsTrigger value="editor">Curve Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <CurveVersionChart
            versions={versions}
            currentVersionId={currentVersionId}
            onVersionSelect={handleVersionSelect}
            onNewVersion={versionManager.handleNewMainVersion}
            onSetMainVersion={handleSetMainVersion}
          />
        </TabsContent>
        
        <TabsContent value="editor" className="space-y-4">
          <div>Curve Editor will be shown here when a version is selected</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurveEditorSection;
