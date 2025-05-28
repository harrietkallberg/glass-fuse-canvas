
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Edit3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCurves } from "@/hooks/useCurves";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import ProjectInformationSection from "@/components/project-editor/ProjectInformationSection";
import CurveEditorSection from "@/components/project-editor/CurveEditorSection";

const CurveEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    loadCurveVersion, 
    getCurveVersions, 
    numberToSemantic 
  } = useCurves();

  const isNewCurve = !id;
  const [loading, setLoading] = useState(!isNewCurve);
  const [activeSection, setActiveSection] = useState<"project" | "editor">("project");
  
  // Project state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [currentCurveId, setCurrentCurveId] = useState<string | null>(id || null);
  
  // Version state
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [currentVersionData, setCurrentVersionData] = useState<any>(null);
  
  // Template state
  const [templateCurveData, setTemplateCurveData] = useState<any>({
    phases: [
      { id: "1", targetTemp: 540, duration: 60, holdTime: 0 },
      { id: "2", targetTemp: 800, duration: 30, holdTime: 10 },
      { id: "3", targetTemp: 520, duration: 60, holdTime: 30 },
      { id: "4", targetTemp: 460, duration: 60, holdTime: 0 },
      { id: "5", targetTemp: 20, duration: 60, holdTime: 0 }
    ],
    temperatureUnit: 'celsius'
  });

  // Load existing curve if editing
  useEffect(() => {
    const loadCurve = async () => {
      if (!isNewCurve && id && user) {
        setLoading(true);
        
        // First get the curve info to get the project title and description
        const { data: curveInfo, error: curveError } = await supabase
          .from('curves')
          .select('title, description')
          .eq('id', id)
          .single();

        if (curveError) {
          console.error('Error loading curve info:', curveError);
          toast({
            title: "Error",
            description: "Failed to load project information",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        if (curveInfo) {
          setProjectTitle(curveInfo.title);
          setProjectDescription(curveInfo.description || '');
        }
        
        const versionsList = await getCurveVersions(id);
        const currentVersion = versionsList.find(v => v.is_current) || versionsList[0];
        
        if (currentVersion) {
          const curveData = await loadCurveVersion(currentVersion.id);
          if (curveData) {
            // Use first version as template fallback
            setTemplateCurveData({
              phases: curveData.phases,
              settings: {
                selectedGlass: curveData.version.selected_glass,
                roomTemp: curveData.version.room_temp,
                glassLayers: curveData.version.glass_layers,
                glassRadius: curveData.version.glass_radius,
                firingType: curveData.version.firing_type,
                topTempMinutes: curveData.version.top_temp_minutes,
                ovenType: curveData.version.oven_type,
              }
            });
            
            setCurrentCurveId(id);
            setCurrentVersionId(currentVersion.id);
            setVersions(versionsList);
            setCurrentVersionData(curveData);
          }
        }
        
        setLoading(false);
      }
    };

    loadCurve();
  }, [id, isNewCurve, user]);

  const handleCreateProject = async (title: string, description: string, curveData: any) => {
    if (!user) return;

    try {
      const { data: newCurve, error } = await supabase
        .from('curves')
        .insert({
          user_id: user.id,
          title,
          description
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating curve:', error);
        toast({
          title: "Error",
          description: "Failed to create project",
          variant: "destructive"
        });
        return;
      }
      
      setCurrentCurveId(newCurve.id);
      setProjectTitle(title);
      setProjectDescription(description);
      setTemplateCurveData(curveData);
      
      toast({
        title: "Project created!",
        description: "Your project has been created successfully.",
      });

      navigate(`/edit/${newCurve.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProject = async (title: string, description: string) => {
    if (!currentCurveId || !user) return;

    try {
      const { error } = await supabase
        .from('curves')
        .update({ 
          title, 
          description,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCurveId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating project:', error);
        toast({
          title: "Error",
          description: "Failed to update project information",
          variant: "destructive"
        });
        return;
      }

      setProjectTitle(title);
      setProjectDescription(description);
      
      toast({
        title: "Project updated!",
        description: "Project information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project information",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              {isNewCurve ? "Create New Project" : projectTitle || "Edit Project"}
            </h1>
          </div>
          
          {!isNewCurve && (
            <div className="flex gap-2">
              <Button
                variant={activeSection === "project" ? "default" : "outline"}
                onClick={() => setActiveSection("project")}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Project Info
              </Button>
              <Button
                variant={activeSection === "editor" ? "default" : "outline"}
                onClick={() => setActiveSection("editor")}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Curve Editor
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {(isNewCurve || activeSection === "project") && (
            <ProjectInformationSection
              isNewCurve={isNewCurve}
              projectTitle={projectTitle}
              setProjectTitle={setProjectTitle}
              projectDescription={projectDescription}
              setProjectDescription={setProjectDescription}
              templateCurveData={templateCurveData}
              setTemplateCurveData={setTemplateCurveData}
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              curveId={currentCurveId}
            />
          )}
          
          {!isNewCurve && activeSection === "editor" && (
            <CurveEditorSection
              curveId={currentCurveId!}
              versions={versions}
              setVersions={setVersions}
              currentVersionId={currentVersionId}
              setCurrentVersionId={setCurrentVersionId}
              currentVersionData={currentVersionData}
              setCurrentVersionData={setCurrentVersionData}
              templateCurveData={templateCurveData}
              numberToSemantic={numberToSemantic}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurveEditPage;
