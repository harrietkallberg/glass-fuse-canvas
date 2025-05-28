import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { ArrowLeft, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCurves } from "@/hooks/useCurves";
import ProjectInformationSection from "@/components/project-editor/ProjectInformationSection";
import CurveEditorSection from "@/components/project-editor/CurveEditorSection";
import { supabase } from "@/integrations/supabase/client";

const CurveEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    createCurve, 
    loadCurveVersion, 
    getCurveVersions,
    numberToSemantic
  } = useCurves();
  
  const isNewCurve = !id || id === "new";
  const [activeSection, setActiveSection] = useState<"project" | "editor">("project");
  const [currentCurveId, setCurrentCurveId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNewCurve);
  
  // Project-level data (static across versions)
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [templateCurveData, setTemplateCurveData] = useState<any>(null);
  
  // Version-specific data
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersionData, setCurrentVersionData] = useState<any>(null);

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
        
        // First get the curve info to get the project title, description and template
        const { data: curveInfo } = await supabase
          .from('curves')
          .select('title, description, template_data')
          .eq('id', id)
          .single();

        if (curveInfo) {
          setProjectTitle(curveInfo.title);
          setProjectDescription(curveInfo.description || '');
          
          // Load template data if it exists
          if (curveInfo.template_data) {
            try {
              const parsedTemplate = JSON.parse(curveInfo.template_data);
              setTemplateCurveData(parsedTemplate);
            } catch (error) {
              console.error('Error parsing template data:', error);
            }
          }
        }
        
        const versionsList = await getCurveVersions(id);
        const currentVersion = versionsList.find(v => v.is_current) || versionsList[0];
        
        if (currentVersion) {
          const curveData = await loadCurveVersion(currentVersion.id);
          if (curveData) {
            // If no template data was loaded from curve, use first version as template fallback
            if (!curveInfo?.template_data) {
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
            }
            
            setCurrentCurveId(id);
            setCurrentVersionId(currentVersion.id);
            setVersions(versionsList);
            setCurrentVersionData(curveData);
          }
        } else if (!curveInfo?.template_data) {
          // No versions and no template - set default template
          setTemplateCurveData({
            phases: [
              { id: "1", targetTemp: 540, duration: 60, holdTime: 0 },
              { id: "2", targetTemp: 800, duration: 30, holdTime: 10 },
              { id: "3", targetTemp: 520, duration: 60, holdTime: 30 },
              { id: "4", targetTemp: 460, duration: 60, holdTime: 0 },
              { id: "5", targetTemp: 20, duration: 60, holdTime: 0 }
            ],
            temperatureUnit: 'celsius'
          });
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
          description,
          template_data: JSON.stringify(curveData)
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-glass-gradient-1 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50/30 to-orange-50/30">
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
        <div className="glass-card p-8 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">
              {isNewCurve ? "Create New Project" : projectTitle}
            </h1>
            {!isNewCurve && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{projectDescription}</p>
            )}
          </div>
        </div>
        
        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          {!isNewCurve && (
            <div className="w-64 space-y-2">
              <Button
                variant={activeSection === "project" ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12"
                onClick={() => setActiveSection("project")}
              >
                <FileText className="h-5 w-5" />
                Project Information
              </Button>
              <Button
                variant={activeSection === "editor" ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12"
                onClick={() => setActiveSection("editor")}
              >
                <TrendingUp className="h-5 w-5" />
                Curve Editor
              </Button>
            </div>
          )}
          
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
    </div>
  );
};

export default CurveEditPage;
