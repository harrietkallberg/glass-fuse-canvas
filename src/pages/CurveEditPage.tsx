
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { useCurves } from "@/hooks/useCurves";
import ProjectInformationSection from "@/components/project-editor/ProjectInformationSection";
import CurveEditorSection from "@/components/project-editor/CurveEditorSection";
import ProjectHeader from "@/components/project-editor/ProjectHeader";
import ProjectSidebar from "@/components/project-editor/ProjectSidebar";
import { useProjectState } from "@/hooks/useProjectState";
import { useProjectLoader } from "@/hooks/useProjectLoader";

const CurveEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { numberToSemantic } = useCurves();
  const isNewCurve = !id || id === "new";
  
  const projectState = useProjectState();
  const { authLoading, handleUpdateProject } = useProjectLoader({
    id,
    isNewCurve,
    ...projectState
  });

  if (authLoading || projectState.loading) {
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
        
        <ProjectHeader 
          projectTitle={projectState.projectTitle}
          projectDescription={projectState.projectDescription}
        />
        
        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Sidebar Navigation - Always show when we have a curve ID */}
          {projectState.currentCurveId && (
            <ProjectSidebar 
              activeSection={projectState.activeSection}
              setActiveSection={projectState.setActiveSection}
            />
          )}
          
          {/* Main Content Area */}
          <div className="flex-1">
            {(!projectState.currentCurveId || projectState.activeSection === "project") && (
              <ProjectInformationSection
                isNewCurve={isNewCurve}
                projectTitle={projectState.projectTitle}
                setProjectTitle={projectState.setProjectTitle}
                projectDescription={projectState.projectDescription}
                setProjectDescription={projectState.setProjectDescription}
                templateCurveData={projectState.templateCurveData}
                setTemplateCurveData={projectState.setTemplateCurveData}
                onUpdateProject={handleUpdateProject}
                curveId={projectState.currentCurveId || undefined}
              />
            )}
            
            {projectState.currentCurveId && projectState.activeSection === "editor" && (
              <CurveEditorSection
                curveId={projectState.currentCurveId}
                versions={projectState.versions}
                setVersions={projectState.setVersions}
                currentVersionId={projectState.currentVersionId}
                setCurrentVersionId={projectState.setCurrentVersionId}
                currentVersionData={projectState.currentVersionData}
                setCurrentVersionData={projectState.setCurrentVersionData}
                templateCurveData={projectState.templateCurveData}
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
