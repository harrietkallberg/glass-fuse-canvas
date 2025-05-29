
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CurveChart from "./CurveChart";
import CurveTableView from "./CurveTableView";
import PhaseControls from "./PhaseControls";
import { Phase } from "@/utils/curveUtils";

interface CurveEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  phases: Phase[];
  templatePhases?: Phase[];
  roomTemp: number;
  currentVersionName: string;
  onUpdatePhase: (index: number, field: keyof Phase, value: number) => void;
  onAddPhase: () => void;
  onRemovePhase: (index: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  materials: string;
  setMaterials: (materials: string) => void;
  tags: string;
  setTags: (tags: string) => void;
}

const CurveEditorTabs = ({
  activeTab,
  setActiveTab,
  phases,
  templatePhases = [],
  roomTemp,
  currentVersionName,
  onUpdatePhase,
  onAddPhase,
  onRemovePhase,
  notes,
  setNotes,
  materials,
  setMaterials,
  tags,
  setTags
}: CurveEditorTabsProps) => {
  return (
    <div className="glass-card bg-white/40 backdrop-blur-sm rounded-3xl border border-white/30 p-8 shadow-xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50">
          <TabsTrigger value="curve" className="text-lg py-3">Curve View</TabsTrigger>
          <TabsTrigger value="table" className="text-lg py-3">Table View</TabsTrigger>
          <TabsTrigger value="phases" className="text-lg py-3">Edit Phases</TabsTrigger>
          <TabsTrigger value="notes" className="text-lg py-3">Notes & Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curve" className="mt-6">
          {/* Match project info site width */}
          <div className="w-full max-w-[800px] mx-auto">
            <CurveChart 
              phases={phases}
              roomTemp={roomTemp}
              templatePhases={templatePhases}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          {/* Match project info site width */}
          <div className="w-full max-w-[800px] mx-auto">
            <CurveTableView 
              phases={phases}
              templatePhases={templatePhases}
              versionName={currentVersionName}
              roomTemp={roomTemp}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="phases" className="mt-6">
          {/* Match project info site width */}
          <div className="w-full max-w-[800px] mx-auto">
            <PhaseControls 
              phases={phases}
              onUpdatePhase={onUpdatePhase}
              onAddPhase={onAddPhase}
              onRemovePhase={onRemovePhase}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6 space-y-6">
          {/* Match project info site width */}
          <div className="w-full max-w-[800px] mx-auto space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this version..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="materials">Materials Used</Label>
              <Textarea
                id="materials"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="List materials used in this firing..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Textarea
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags (comma separated)..."
                className="min-h-[60px]"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurveEditorTabs;
