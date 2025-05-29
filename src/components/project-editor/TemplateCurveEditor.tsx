import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CurveEditor from "@/components/curve-editor/CurveEditor";
import { Phase } from "@/utils/curveUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface TemplateCurveEditorProps {
  isNewCurve: boolean;
  templateCurveData: any;
  setTemplateCurveData: (data: any) => void;
  curveId?: string;
  onTemplateConfirmed?: (newProjectData?: { title: string; description: string; curveData: any }) => void;
  projectTitle?: string;
  projectDescription?: string;
}

// Default template phases
const defaultPhases: Phase[] = [
  { id: "1", targetTemp: 540, duration: 60, holdTime: 0 },
  { id: "2", targetTemp: 800, duration: 30, holdTime: 10 },
  { id: "3", targetTemp: 520, duration: 60, holdTime: 30 },
  { id: "4", targetTemp: 460, duration: 60, holdTime: 0 },
  { id: "5", targetTemp: 20, duration: 60, holdTime: 0 }
];

const TemplateCurveEditor = ({
  isNewCurve,
  templateCurveData,
  setTemplateCurveData,
  curveId,
  onTemplateConfirmed,
  projectTitle = "",
  projectDescription = ""
}: TemplateCurveEditorProps) => {
  const [localCurveData, setLocalCurveData] = useState(templateCurveData);
  const [hasTemplateChanges, setHasTemplateChanges] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [originalPhases, setOriginalPhases] = useState<Phase[]>([]);
  const { user } = useAuth();
  const temperatureUnit = "celsius";

  // Set original phases when templateCurveData changes
  useEffect(() => {
    if (templateCurveData?.phases) {
      setOriginalPhases([...templateCurveData.phases]);
      setLocalCurveData(templateCurveData);
      setHasTemplateChanges(false);
    } else if (isNewCurve) {
      // For new projects, set default phases and mark as changed
      const defaultCurveData = {
        phases: defaultPhases,
        temperatureUnit,
      };
      setLocalCurveData(defaultCurveData);
      setTemplateCurveData(defaultCurveData);
      setOriginalPhases([]);
      setHasTemplateChanges(true);
    }
  }, [templateCurveData, isNewCurve, setTemplateCurveData]);

  // Compare phases to detect changes
  const phasesHaveChanged = (newPhases: Phase[], originalPhases: Phase[]) => {
    if (newPhases.length !== originalPhases.length) return true;
    
    return newPhases.some((phase, index) => {
      const original = originalPhases[index];
      return !original || 
        phase.targetTemp !== original.targetTemp ||
        phase.duration !== original.duration ||
        phase.holdTime !== original.holdTime;
    });
  };

  const handleCurveChange = (phases: Phase[]) => {
    const curveData = {
      phases,
      temperatureUnit,
    };
    
    setLocalCurveData(curveData);
    setTemplateCurveData(curveData);
    
    // Check if phases have actually changed from original
    const hasChanges = phasesHaveChanged(phases, originalPhases);
    setHasTemplateChanges(hasChanges || isNewCurve);
  };

  const handleConfirmTemplate = async () => {
    if (!localCurveData?.phases || !user) {
      return;
    }

    // For new projects, create the project with the template
    if (isNewCurve) {
      if (!projectTitle.trim()) {
        toast({
          title: "Project title required",
          description: "Please enter a project title before confirming the template.",
          variant: "destructive"
        });
        return;
      }

      setHasTemplateChanges(false);
      setOriginalPhases([...localCurveData.phases]);
      
      if (onTemplateConfirmed) {
        onTemplateConfirmed({
          title: projectTitle,
          description: projectDescription,
          curveData: { 
            ...localCurveData, 
            temperatureUnit
          }
        });
      }
      return;
    }

    // For existing projects, save template to database
    if (!curveId) {
      return;
    }

    setIsSavingTemplate(true);

    try {
      // Get the template version (version 0.0) or create it if it doesn't exist
      let { data: templateVersion, error: fetchError } = await supabase
        .from('curve_versions')
        .select('*')
        .eq('curve_id', curveId)
        .eq('version_number', 0)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching template version:', fetchError);
        toast({
          title: "Error",
          description: "Failed to fetch project template",
          variant: "destructive"
        });
        return;
      }

      if (!templateVersion) {
        // Create template version
        const { data: newTemplateVersion, error: createError } = await supabase
          .from('curve_versions')
          .insert({
            curve_id: curveId,
            version_number: 0,
            name: 'Template',
            is_current: false,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating template version:', createError);
          toast({
            title: "Error",
            description: "Failed to create project template",
            variant: "destructive"
          });
          return;
        }

        templateVersion = newTemplateVersion;
      }

      // Delete existing template phases
      await supabase
        .from('curve_phases')
        .delete()
        .eq('version_id', templateVersion.id);

      // Save new template phases
      const phasesToInsert = localCurveData.phases.map((phase: Phase, index: number) => ({
        version_id: templateVersion.id,
        phase_order: index,
        target_temp: phase.targetTemp,
        duration: phase.duration,
        hold_time: phase.holdTime,
      }));

      const { error: phasesError } = await supabase
        .from('curve_phases')
        .insert(phasesToInsert);

      if (phasesError) {
        console.error('Error saving template phases:', phasesError);
        toast({
          title: "Error",
          description: "Failed to save project template",
          variant: "destructive"
        });
        return;
      }

      // Update original phases to reflect the new saved state
      setOriginalPhases([...localCurveData.phases]);
      setHasTemplateChanges(false);
      
      if (onTemplateConfirmed) {
        onTemplateConfirmed();
      }
      
      toast({
        title: "Template confirmed!",
        description: "Project template has been saved and will be available across all project sections.",
      });

    } catch (error) {
      console.error('Error confirming project template:', error);
      toast({
        title: "Error",
        description: "Failed to confirm project template",
        variant: "destructive"
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // Show button when there are template changes OR for new projects that need template confirmation
  const showConfirmButton = hasTemplateChanges || (isNewCurve && localCurveData?.phases);

  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Template Curve Configuration</h3>
        {!isNewCurve && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Project Template
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-600 mb-6">
        {isNewCurve 
          ? "Configure your base firing curve template. This will serve as the starting point for all versions and create your project."
          : "This is your project's base template curve. Make changes and click 'Confirm Template for Project' to save them across all project sections."
        }
      </div>
      
      <CurveEditor
        initialPhases={localCurveData?.phases || defaultPhases}
        onSave={handleCurveChange}
        isTemplateMode={true}
      />

      {/* Template Confirmation Button */}
      {showConfirmButton && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleConfirmTemplate}
            disabled={isSavingTemplate || (isNewCurve && !projectTitle.trim())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            {isSavingTemplate ? "Saving..." : 
             isNewCurve ? "Confirm Template & Create Project" : 
             "Confirm Template for Project"}
          </Button>
          {hasTemplateChanges && (
            <div className="ml-3 flex items-center text-sm text-orange-600">
              <span>• Unsaved template changes</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateCurveEditor;
