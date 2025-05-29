
import { useState } from "react";

export const useProjectState = () => {
  const [activeSection, setActiveSection] = useState<"project" | "editor">("project");
  const [currentCurveId, setCurrentCurveId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Project-level data (static across versions)
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [templateCurveData, setTemplateCurveData] = useState<any>(null);
  
  // Version-specific data
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersionData, setCurrentVersionData] = useState<any>(null);

  return {
    activeSection,
    setActiveSection,
    currentCurveId,
    setCurrentCurveId,
    currentVersionId,
    setCurrentVersionId,
    loading,
    setLoading,
    projectTitle,
    setProjectTitle,
    projectDescription,
    setProjectDescription,
    templateCurveData,
    setTemplateCurveData,
    versions,
    setVersions,
    currentVersionData,
    setCurrentVersionData,
  };
};
