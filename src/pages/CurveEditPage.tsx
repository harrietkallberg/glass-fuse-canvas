
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import CurveEditor from "@/components/CurveEditor";
import ProjectDetailsTab from "@/components/ProjectDetailsTab";
import CurveVersionChart from "@/components/CurveVersionChart";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCurves } from "@/hooks/useCurves";
import { useCurveState } from "@/hooks/useCurveState";

interface Phase {
  id: string;
  targetTemp: number;
  duration: number;
  holdTime: number;
}

// Default phases for new curves
const defaultPhases = [
  { id: "1", targetTemp: 540, duration: 60, holdTime: 0 },
  { id: "2", targetTemp: 800, duration: 30, holdTime: 10 },
  { id: "3", targetTemp: 520, duration: 60, holdTime: 30 },
  { id: "4", targetTemp: 460, duration: 60, holdTime: 0 },
  { id: "5", targetTemp: 20, duration: 60, holdTime: 0 }
];

const CurveEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { createCurve, saveCurveVersion, loadCurveVersion, getCurveVersions, numberToSemantic } = useCurves();
  
  const isNewCurve = !id || id === "new";
  const [currentCurveId, setCurrentCurveId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNewCurve);
  
  // Project-level info (read-only after creation)
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  
  // Version-specific data
  const [currentVersionName, setCurrentVersionName] = useState("1.0");
  const [notes, setNotes] = useState("");
  const [materials, setMaterials] = useState("");
  const [tags, setTags] = useState("");
  const [activeTab, setActiveTab] = useState("curve");
  const [versions, setVersions] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<"edit" | "new">("edit");
  const [selectedVersionColor, setSelectedVersionColor] = useState("#F97316");

  const curveState = useCurveState({ initialPhases: defaultPhases });

  // Generate dynamic background gradient based on selected version
  const getBackgroundGradient = () => {
    const baseColor = selectedVersionColor;
    return `linear-gradient(135deg, ${baseColor}08 0%, ${baseColor}15 50%, #33C3F008 100%)`;
  };

  // Generate semantic version number
  const getNextVersionNumber = (existingVersions: any[], isNewVersion: boolean) => {
    if (existingVersions.length === 0) return "1.0";
    
    const currentVersion = existingVersions.find(v => v.id === currentVersionId);
    if (!currentVersion) return `${existingVersions.length + 1}.0`;
    
    const currentSemantic = numberToSemantic(currentVersion.version_number);
    
    if (isNewVersion) {
      // Create new major version
      const majorVersions = existingVersions.map(v => Math.floor(v.version_number / 10000));
      const maxMajor = Math.max(...majorVersions);
      return `${maxMajor + 1}.0`;
    } else {
      // Create minor version increment
      const [major, minor = "0"] = currentSemantic.split('.');
      return `${major}.${parseInt(minor) + 1}`;
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Load existing curve if editing
  useEffect(() => {
    const loadCurve = async () => {
      if (!isNewCurve && id && user) {
        setLoading(true);
        
        const versionsList = await getCurveVersions(id);
        const currentVersion = versionsList.find(v => v.is_current) || versionsList[0];
        
        if (currentVersion) {
          const curveData = await loadCurveVersion(currentVersion.id);
          if (curveData) {
            // Set project-level info (read-only)
            setProjectTitle(curveData.version.name || 'Untitled Project');
            setProjectDescription(curveData.version.notes || '');
            
            setCurrentCurveId(id);
            setCurrentVersionId(currentVersion.id);
            setCurrentVersionName(numberToSemantic(currentVersion.version_number));
            setVersions(versionsList);
            
            // Update curve state with loaded data
            curveState.setPhases(curveData.phases);
            if (curveData.version.selected_glass) curveState.setSelectedGlass(curveData.version.selected_glass);
            if (curveData.version.room_temp) curveState.setRoomTemp(curveData.version.room_temp);
            if (curveData.version.glass_layers) curveState.setGlassLayers(curveData.version.glass_layers);
            if (curveData.version.glass_radius) curveState.setGlassRadius(curveData.version.glass_radius);
            if (curveData.version.firing_type) curveState.setFiringType(curveData.version.firing_type);
            if (curveData.version.top_temp_minutes) curveState.setTopTempMinutes(curveData.version.top_temp_minutes);
            if (curveData.version.oven_type) curveState.setOvenType(curveData.version.oven_type);
            
            setNotes(curveData.version.notes || '');
            setMaterials(curveData.version.materials || '');
            setTags(curveData.version.tags || '');
          }
        }
        
        setLoading(false);
      }
    };

    loadCurve();
  }, [id, isNewCurve, user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      let curveId = currentCurveId;

      // Create new curve if this is a new curve
      if (isNewCurve) {
        const newCurve = await createCurve(projectTitle, projectDescription);
        if (!newCurve) {
          toast({
            title: "Error",
            description: "Failed to create curve",
            variant: "destructive"
          });
          return;
        }
        curveId = newCurve.id;
        setCurrentCurveId(curveId);
      }

      if (!curveId) return;

      // Generate semantic version number
      const versionNumber = getNextVersionNumber(versions, editMode === "new");

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
        setCurrentVersionName(versionNumber);
        
        // Refresh versions list
        const updatedVersions = await getCurveVersions(curveId);
        setVersions(updatedVersions);
        
        toast({
          title: "Curve saved!",
          description: editMode === "new" 
            ? `New version ${versionNumber} created successfully.` 
            : "Your firing curve has been saved successfully.",
        });

        // Navigate to the curve edit page if this was a new curve
        if (isNewCurve) {
          navigate(`/edit/${curveId}`);
        }
        
        // Reset to edit mode after saving
        setEditMode("edit");
      }
    } catch (error) {
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
      setCurrentVersionName(numberToSemantic(curveData.version.version_number));
      
      // Generate new color for selected version
      const colors = ["#F97316", "#33C3F0", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
      const versionIndex = versions.findIndex(v => v.id === versionId);
      setSelectedVersionColor(colors[versionIndex % colors.length]);
      
      // Update curve state with loaded data
      curveState.setPhases(curveData.phases);
      if (curveData.version.selected_glass) curveState.setSelectedGlass(curveData.version.selected_glass);
      if (curveData.version.room_temp) curveState.setRoomTemp(curveData.version.room_temp);
      if (curveData.version.glass_layers) curveState.setGlassLayers(curveData.version.glass_layers);
      if (curveData.version.glass_radius) curveState.setGlassRadius(curveData.version.glass_radius);
      if (curveData.version.firing_type) curveState.setFiringType(curveData.version.firing_type);
      if (curveData.version.top_temp_minutes) curveState.setTopTempMinutes(curveData.version.top_temp_minutes);
      if (curveData.version.oven_type) curveState.setOvenType(curveData.version.oven_type);
      
      setNotes(curveData.version.notes || '');
      setMaterials(curveData.version.materials || '');
      setTags(curveData.version.tags || '');
      setEditMode("edit");
    }
  };

  const handleNewVersion = () => {
    setEditMode("new");
    toast({
      title: "New Version Mode",
      description: "You're now creating a new version. Save to create it.",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-glass-gradient-1 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen pb-20"
      style={{ background: getBackgroundGradient() }}
    >
      <Navigation />
      
      <div className="container mx-auto pt-24 px-4">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Project Header */}
        <div className="mb-8 glass-card p-8 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
          {isNewCurve ? (
            <div className="space-y-6">
              <div>
                <label className="text-lg font-semibold text-gray-800 mb-3 block">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-lg"
                  placeholder="Enter project name..."
                />
              </div>
              
              <div>
                <label className="text-lg font-semibold text-gray-800 mb-3 block">
                  Project Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-lg"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSave}
                  className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-8 py-3 text-lg"
                >
                  Create Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{projectTitle}</h1>
                <p className="text-xl text-gray-600">{projectDescription}</p>
              </div>
              
              {/* Current Version Info */}
              <div className="flex items-center justify-between bg-white/50 rounded-xl p-4">
                <div>
                  <span className="text-lg font-medium text-gray-700">Currently editing: </span>
                  <span className="font-bold text-2xl" style={{ color: selectedVersionColor }}>
                    Version {currentVersionName}
                  </span>
                  {editMode === "new" && (
                    <span className="ml-3 text-sm bg-green-500/20 text-green-700 px-3 py-1 rounded-full">
                      New Version Mode
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handleSave}
                  className="px-8 py-3 text-lg font-medium"
                  style={{ 
                    backgroundColor: selectedVersionColor,
                    color: 'white'
                  }}
                >
                  {editMode === "new" ? "Save as New Version" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Version Chart */}
        {!isNewCurve && (
          <div className="mb-8">
            <CurveVersionChart 
              versions={versions.map(v => ({
                ...v,
                version_number: numberToSemantic(v.version_number) // Convert to semantic version for display
              }))}
              currentVersionId={currentVersionId}
              onVersionSelect={handleVersionSelect}
              onNewVersion={handleNewVersion}
              selectedVersionColor={selectedVersionColor}
            />
          </div>
        )}
        
        {/* Main Editor */}
        <div className="glass-card p-8 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6 p-2 bg-white/50">
              <TabsTrigger value="curve" className="flex-1 text-lg py-3">Curve Editor</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1 text-lg py-3">Notes & Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curve" className="mt-6 space-y-6">
              <CurveEditor initialPhases={curveState.phases} onSave={handleSave} />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-6 space-y-6">
              <ProjectDetailsTab 
                notes={notes} 
                setNotes={setNotes}
                materials={materials}
                setMaterials={setMaterials}
                tags={tags}
                setTags={setTags}
                handleSave={handleSave}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CurveEditPage;
