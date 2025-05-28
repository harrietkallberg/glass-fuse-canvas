
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import CurveVersionChart from "@/components/CurveVersionChart";
import VersionInfoDisplay from "@/components/curve-editor/VersionInfoDisplay";
import CurveEditorTabs from "@/components/curve-editor/CurveEditorTabs";
import { useVersionManager } from "@/components/curve-editor/VersionManager";
import { useCurveState } from "@/hooks/useCurveState";

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
  const [activeTab, setActiveTab] = useState("curve");
  const [selectedVersionColor, setSelectedVersionColor] = useState("#F97316");
  const [notes, setNotes] = useState(currentVersionData?.version?.notes || "");
  const [materials, setMaterials] = useState(currentVersionData?.version?.materials || "");
  const [tags, setTags] = useState(currentVersionData?.version?.tags || "");

  // Initialize curve state with current version phases or template phases
  const initialPhases = currentVersionData?.phases || templateCurveData?.phases || [];
  const curveState = useCurveState({ initialPhases });

  // Update curve state when version data changes
  React.useEffect(() => {
    if (currentVersionData) {
      curveState.setPhases(currentVersionData.phases);
      setNotes(currentVersionData.version.notes || "");
      setMaterials(currentVersionData.version.materials || "");
      setTags(currentVersionData.version.tags || "");
      
      // Update other curve settings from version data
      if (currentVersionData.version.selected_glass) curveState.setSelectedGlass(currentVersionData.version.selected_glass);
      if (currentVersionData.version.room_temp) curveState.setRoomTemp(currentVersionData.version.room_temp);
      if (currentVersionData.version.glass_layers) curveState.setGlassLayers(currentVersionData.version.glass_layers);
      if (currentVersionData.version.glass_radius) curveState.setGlassRadius(currentVersionData.version.glass_radius);
      if (currentVersionData.version.firing_type) curveState.setFiringType(currentVersionData.version.firing_type);
      if (currentVersionData.version.top_temp_minutes) curveState.setTopTempMinutes(currentVersionData.version.top_temp_minutes);
      if (currentVersionData.version.oven_type) curveState.setOvenType(currentVersionData.version.oven_type);
    } else if (templateCurveData) {
      // If no current version, initialize with template
      curveState.setPhases(templateCurveData.phases || []);
    }
  }, [currentVersionData, templateCurveData]);

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
    await versionManager.handleVersionSelect(versionId);
    
    // Generate new color for selected version
    const colors = ["#F97316", "#33C3F0", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
    const versionIndex = versions.findIndex(v => v.id === versionId);
    setSelectedVersionColor(colors[versionIndex % colors.length]);
  };

  const currentVersionName = currentVersionId 
    ? numberToSemantic(versions.find(v => v.id === currentVersionId)?.version_number || 10000)
    : "1.0";

  return (
    <div className="space-y-8">
      {/* Version Chart */}
      <CurveVersionChart 
        versions={versions.map(v => ({
          ...v,
          version_number: numberToSemantic(v.version_number)
        }))}
        currentVersionId={currentVersionId}
        onVersionSelect={handleVersionSelect}
        onNewVersion={versionManager.handleNewMainVersion}
        selectedVersionColor={selectedVersionColor}
      />
      
      {/* Current Version Info */}
      <VersionInfoDisplay 
        currentVersionName={currentVersionName}
        selectedVersionColor={selectedVersionColor}
      />

      {/* Main Editor */}
      <CurveEditorTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        phases={curveState.phases}
        templatePhases={templateCurveData?.phases || []}
        roomTemp={curveState.roomTemp}
        currentVersionName={currentVersionName}
        onUpdatePhase={curveState.updatePhase}
        onAddPhase={curveState.addPhase}
        onRemovePhase={curveState.removePhase}
        notes={notes}
        setNotes={setNotes}
        materials={materials}
        setMaterials={setMaterials}
        tags={tags}
        setTags={setTags}
      />

      {/* Single Save Button at Bottom */}
      <div className="flex justify-center">
        <Button 
          onClick={versionManager.handleSave}
          className="px-8 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white text-lg"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CurveEditorSection;
