
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import CurveVersionChart from "@/components/CurveVersionChart";
import ProjectDetailsTab from "@/components/ProjectDetailsTab";
import CurveStaticDisplay from "@/components/project-editor/CurveStaticDisplay";
import CurveChart from "@/components/curve-editor/CurveChart";
import { useCurves } from "@/hooks/useCurves";
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

  const { 
    saveCurveVersion, 
    loadCurveVersion, 
    getCurveVersions,
    getNextVersionNumber
  } = useCurves();

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

  const handleVersionSelect = async (versionId: string) => {
    if (!versionId || versionId === currentVersionId) return;
    
    const curveData = await loadCurveVersion(versionId);
    if (curveData) {
      setCurrentVersionId(versionId);
      setCurrentVersionData(curveData);
      
      // Generate new color for selected version
      const colors = ["#F97316", "#33C3F0", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
      const versionIndex = versions.findIndex(v => v.id === versionId);
      setSelectedVersionColor(colors[versionIndex % colors.length]);
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
        onNewVersion={handleNewMainVersion}
        selectedVersionColor={selectedVersionColor}
      />
      
      {/* Current Version Info */}
      <div className="glass-card p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-700">
            Currently editing: <span className="font-bold text-2xl" style={{ color: selectedVersionColor }}>
              Version {currentVersionName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 p-2 bg-white/50">
            <TabsTrigger value="curve" className="flex-1 text-lg py-3">Curve View</TabsTrigger>
            <TabsTrigger value="table" className="flex-1 text-lg py-3">Table View</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1 text-lg py-3">Notes & Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curve" className="mt-6 space-y-6">
            <CurveChart 
              phases={curveState.phases}
              roomTemp={curveState.roomTemp}
              templatePhases={templateCurveData?.phases || []}
            />
            
            {/* Phase Controls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Curve Phases</h4>
                <Button onClick={curveState.addPhase} variant="outline" size="sm">
                  Add Phase
                </Button>
              </div>
              
              <div className="space-y-2">
                {curveState.phases.map((phase, index) => (
                  <div key={phase.id} className="flex items-center gap-4 p-3 bg-white/50 rounded-lg">
                    <span className="min-w-[80px] text-sm font-medium">Phase {index + 1}</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={phase.targetTemp}
                        onChange={(e) => curveState.updatePhase(phase.id, 'targetTemp', Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="Temp"
                      />
                      <span className="text-xs self-center">°C</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={phase.duration}
                        onChange={(e) => curveState.updatePhase(phase.id, 'duration', Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="Duration"
                      />
                      <span className="text-xs self-center">min</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={phase.holdTime}
                        onChange={(e) => curveState.updatePhase(phase.id, 'holdTime', Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="Hold"
                      />
                      <span className="text-xs self-center">min</span>
                    </div>
                    {curveState.phases.length > 1 && (
                      <Button 
                        onClick={() => curveState.removePhase(phase.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-6 space-y-6">
            <CurveStaticDisplay
              templatePhases={templateCurveData?.phases || []}
              currentPhases={curveState.phases}
              versionName={currentVersionName}
            />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-6 space-y-6">
            <ProjectDetailsTab 
              notes={notes} 
              setNotes={setNotes}
              materials={materials}
              setMaterials={setMaterials}
              tags={tags}
              setTags={setTags}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Single Save Button at Bottom */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave}
          className="px-8 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white text-lg"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CurveEditorSection;
