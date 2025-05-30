
import React, { useState, useEffect } from "react";
import CurveVersionChart from "@/components/CurveVersionChart";
import { useVersionManager } from "@/components/curve-editor/VersionManager";
import { useCurveVersionManager } from "@/hooks/curve/useCurveVersionManager";
import { createCurveState } from "./curve-editor/CurveStateManager";
import CurveEditorDisplay from "./curve-editor/CurveEditorDisplay";

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

  // Use the new version manager hook
  const { handleVersionSelect, handleDuplicateVersion } = useCurveVersionManager({
    curveId,
    versions,
    setVersions,
    currentVersionId,
    setCurrentVersionId,
    setCurrentVersionData,
    numberToSemantic
  });

  // Update form fields when current version data changes
  useEffect(() => {
    if (currentVersionData?.version) {
      setNotes(currentVersionData.version.notes || "");
      setMaterials(currentVersionData.version.materials || "");
      setTags(currentVersionData.version.tags || "");
    }
  }, [currentVersionData]);

  // Create curve state using the extracted utility
  const curveState = createCurveState(currentVersionData, templateCurveData);

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

  const handleEditVersion = async (versionId: string) => {
    await handleVersionSelect(versionId);
    setShowEditor(true);
  };

  const handleDuplicateVersionWrapper = async () => {
    await handleDuplicateVersion(currentVersionData);
  };

  const handleMoveForward = async () => {
    console.log('Moving version forward:', currentVersionId);
    // TODO: Implement move forward logic to increment major version (0.x -> 1.0, 1.x -> 2.0, etc.)
  };

  return (
    <div className="space-y-6">
      {/* Version Flow Chart */}
      <CurveVersionChart
        versions={versions}
        currentVersionId={currentVersionId}
        onVersionSelect={handleVersionSelect}
        onEditVersion={handleEditVersion}
        onDuplicateVersion={handleDuplicateVersionWrapper}
        onMoveForward={handleMoveForward}
      />
      
      {/* Curve Editor - shown when editing a version */}
      <CurveEditorDisplay
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        currentVersionData={currentVersionData}
        curveState={curveState}
        templateCurveData={templateCurveData}
        numberToSemantic={numberToSemantic}
        onSave={versionManager.handleSave}
      />
    </div>
  );
};

export default CurveEditorSection;
