
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
  onUpdateProject,
  curveId
}: ProjectInformationSectionProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const { user } = useAuth();

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
    // Template has been confirmed and saved to database
    console.log('Template confirmed for project:', curveId);
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
        projectTitle={projectTitle}
        projectDescription={projectDescription}
        onTemplateConfirmed={handleTemplateConfirmed}
      />

      <ProjectActions
        isNewCurve={isNewCurve}
        hasChanges={hasChanges}
        projectTitle={projectTitle}
        onUpdateProject={handleUpdateProject}
      />
    </div>
  );
};

export default ProjectInformationSection;
