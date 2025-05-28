
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
  const { createCurve, saveCurveVersion, loadCurveVersion, getCurveVersions } = useCurves();
  
  const isNewCurve = !id || id === "new";
  const [currentCurveId, setCurrentCurveId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNewCurve);
  
  // Project-level info (read-only after creation)
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  
  // Version-specific data
  const [currentVersionName, setCurrentVersionName] = useState("Version 1");
  const [notes, setNotes] = useState("");
  const [materials, setMaterials] = useState("");
  const [tags, setTags] = useState("");
  const [activeTab, setActiveTab] = useState("curve");
  const [versions, setVersions] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<"edit" | "new">("edit");

  const curveState = useCurveState({ initialPhases: defaultPhases });

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
            setCurrentVersionName(`Version ${currentVersion.version_number}`);
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

      // Determine version name based on edit mode
      const versionName = editMode === "new" 
        ? `Version ${versions.length + 1}` 
        : currentVersionName;

      // Save the curve version
      const savedVersion = await saveCurveVersion(
        curveId,
        versionName,
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
        setCurrentVersionName(versionName);
        
        // Refresh versions list
        const updatedVersions = await getCurveVersions(curveId);
        setVersions(updatedVersions);
        
        toast({
          title: "Curve saved!",
          description: editMode === "new" 
            ? "New version created successfully." 
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
      setCurrentVersionName(curveData.version.name);
      
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-glass-gradient-1 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-glass-gradient-1 pb-20">
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
        
        {/* Project Header - Read-only after creation */}
        <div className="mb-6 glass-card p-6 bg-glass-100/20 backdrop-blur-sm rounded-2xl border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Info */}
            <div className="lg:col-span-2 space-y-4">
              {isNewCurve ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A6B6B] focus:border-transparent"
                      placeholder="Enter project name..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Project Description
                    </label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A6B6B] focus:border-transparent"
                      rows={2}
                      placeholder="Describe your project..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{projectTitle}</h1>
                    <p className="text-gray-600 mt-1">{projectDescription}</p>
                  </div>
                  
                  {/* Current Version Info */}
                  <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Currently editing: </span>
                      <span className="font-semibold text-[#2A6B6B]">{currentVersionName}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={editMode === "edit" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditMode("edit")}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit Current
                      </Button>
                      <Button 
                        variant={editMode === "new" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditMode("new")}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        New Version
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Version Chart */}
            {!isNewCurve && (
              <div className="lg:col-span-1">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Version History</h3>
                <CurveVersionChart 
                  versions={versions}
                  currentVersionId={currentVersionId}
                  onVersionSelect={handleVersionSelect}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end pt-4 border-t border-white/10 mt-4">
            <Button 
              onClick={handleSave}
              className="bg-[#2A6B6B] hover:bg-[#1F5555]"
            >
              {isNewCurve ? "Create Project" : editMode === "new" ? "Save as New Version" : "Save Changes"}
            </Button>
          </div>
        </div>
        
        {/* Main Editor */}
        <div className="glass-card p-6 bg-glass-100/20 backdrop-blur-sm rounded-2xl border border-white/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="curve" className="flex-1">Curve Editor</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes & Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curve" className="mt-4 space-y-6">
              <CurveEditor initialPhases={curveState.phases} onSave={handleSave} />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4 space-y-6">
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
