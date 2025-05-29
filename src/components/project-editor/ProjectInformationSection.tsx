
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProjectDetailsForm from "./ProjectDetailsForm";
import TemplateCurveEditor from "./TemplateCurveEditor";
import ProjectActions from "./ProjectActions";

interface ProjectInformationSectionProps {
  isNewCurve: boolean;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  projectDescription: string;
  setProjectDescription: (description: string) => void;
  templateCurveData: any;
  setTemplateCurveData: (data: any) => void;
  onCreateProject: (title: string, description: string, curveData: any) => void;
  onUpdateProject?: (title: string, description: string) => void;
  curveId?: string;
}

const ProjectInformationSection = ({
  isNewCurve,
  projectTitle,
  setProjectTitle,
  projectDescription,
  setProjectDescription,
  templateCurveData,
  setTemplateCurveData,
  onCreateProject,
  onUpdateProject,
  curveId
}: ProjectInformationSectionProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [templateConfirmed, setTemplateConfirmed] = useState(!isNewCurve); // Existing projects start as confirmed
  const { user } = useAuth();
  const temperatureUnit = "celsius";

  const handleCreateProject = () => {
    if (!projectTitle.trim() || !templateConfirmed) {
      return;
    }
    onCreateProject(projectTitle, projectDescription, { 
      ...templateCurveData, 
      temperatureUnit
    });
  };

  const handleUpdateProject = () => {
    if (onUpdateProject) {
      onUpdateProject(projectTitle, projectDescription);
      setHasChanges(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setProjectTitle(value);
    if (!isNewCurve) setHasChanges(true);
  };

  const handleDescriptionChange = (value: string) => {
    setProjectDescription(value);
    if (!isNewCurve) setHasChanges(true);
  };

  const handleTemplateConfirmed = () => {
    setTemplateConfirmed(true);
  };

  return (
    <div className="space-y-8">
      <ProjectDetailsForm
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        isNewCurve={isNewCurve}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
      />

      <TemplateCurveEditor
        isNewCurve={isNewCurve}
        templateCurveData={templateCurveData}
        setTemplateCurveData={setTemplateCurveData}
        curveId={curveId}
        onTemplateConfirmed={handleTemplateConfirmed}
      />

      <ProjectActions
        isNewCurve={isNewCurve}
        hasChanges={hasChanges}
        projectTitle={projectTitle}
        templateConfirmed={templateConfirmed}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
      />
    </div>
  );
};

export default ProjectInformationSection;
