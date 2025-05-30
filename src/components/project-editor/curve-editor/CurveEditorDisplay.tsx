
import React from "react";
import CurveEditor from "@/components/curve-editor/CurveEditor";

interface CurveEditorDisplayProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  currentVersionData: any;
  curveState: any;
  templateCurveData: any;
  numberToSemantic: (num: number) => string;
  onSave: (phases: any[], notes: string, materials: string, tags: string) => Promise<void>;
}

const CurveEditorDisplay = ({
  showEditor,
  setShowEditor,
  currentVersionData,
  curveState,
  templateCurveData,
  numberToSemantic,
  onSave
}: CurveEditorDisplayProps) => {
  if (!showEditor || !currentVersionData) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Editing {currentVersionData.version?.version_number === 0 ? 'Template' : `Version ${numberToSemantic(currentVersionData.version?.version_number)}`}
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
        onSave={onSave}
        isVersionMode={true}
      />
    </div>
  );
};

export default CurveEditorDisplay;
