
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp } from "lucide-react";

interface ProjectSidebarProps {
  activeSection: "project" | "editor";
  setActiveSection: (section: "project" | "editor") => void;
}

const ProjectSidebar = ({ activeSection, setActiveSection }: ProjectSidebarProps) => {
  return (
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
  );
};

export default ProjectSidebar;
