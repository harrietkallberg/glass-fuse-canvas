
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
  onTemplateConfirmed?: () => void;
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
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [isExistingTemplate, setIsExistingTemplate] = useState(false);
  const { user } = useAuth();
  const temperatureUnit = "celsius";

  // Set original phases when templateCurveData changes
  useEffect(() => {
    if (templateCurveData?.phases) {
      setOriginalPhases([...templateCurveData.phases]);
      setLocalCurveData(templateCurveData);
      setHasTemplateChanges(false);
      setIsExistingTemplate(true);
      // Show confirm button immediately if template exists
      setShowConfirmButton(true);
    } else {
      // Set default phases and mark as changed for template setup
      const defaultCurveData = {
        phases: defaultPhases,
        temperatureUnit,
      };
      setLocalCurveData(defaultCurveData);
      setTemplateCurveData(defaultCurveData);
      setOriginalPhases([]);
      setHasTemplateChanges(true);
      setIsExistingTemplate(false);
    }
  }, [templateCurveData, setTemplateCurveData]);

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
    setHasTemplateChanges(hasChanges || originalPhases.length === 0);
  };

  const handleApplyGlassTemplate = () => {
    // Show the confirm button when glass template is applied
    setShowConfirmButton(true);
  };

  const handleConfirmTemplate = async () => {
    if (!localCurveData?.phases || !user || !curveId) {
      toast({
        title: "Error",
        description: "Missing required data to save template.",
        variant: "destructive"
      });
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
            selected_glass: localCurveData.settings?.selectedGlass,
            room_temp: localCurveData.settings?.roomTemp || 20,
            glass_layers: localCurveData.settings?.glassLayers || "1",
            glass_radius: localCurveData.settings?.glassRadius || "10",
            firing_type: localCurveData.settings?.firingType || "f",
            top_temp_minutes: localCurveData.settings?.topTempMinutes || "10",
            oven_type: localCurveData.settings?.ovenType || "t",
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
      } else {
        // Update existing template version with current settings
        const { error: updateError } = await supabase
          .from('curve_versions')
          .update({
            selected_glass: localCurveData.settings?.selectedGlass,
            room_temp: localCurveData.settings?.roomTemp || 20,
            glass_layers: localCurveData.settings?.glassLayers || "1",
            glass_radius: localCurveData.settings?.glassRadius || "10",
            firing_type: localCurveData.settings?.firingType || "f",
            top_temp_minutes: localCurveData.settings?.topTempMinutes || "10",
            oven_type: localCurveData.settings?.ovenType || "t",
          })
          .eq('id', templateVersion.id);

        if (updateError) {
          console.error('Error updating template version:', updateError);
          toast({
            title: "Error",
            description: "Failed to update project template",
            variant: "destructive"
          });
          return;
        }
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
      
      // Show appropriate success message based on whether it was new or updated
      const successMessage = isExistingTemplate 
        ? "Template has been updated!"
        : "Template confirmed!";
      
      const successDescription = isExistingTemplate
        ? "Project template has been updated and will be used for dashboard display."
        : "Project template has been saved and will be used for dashboard display.";
      
      toast({
        title: successMessage,
        description: successDescription,
      });

      // Update the existing template flag
      setIsExistingTemplate(true);

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

  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Template Curve Configuration</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Project Template
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-6">
        {isExistingTemplate 
          ? "Modify your project template. Changes will update the template used for all versions across the project."
          : "Configure your base firing curve template. This will serve as the starting point for all versions across the project."
        }
      </div>
      
      <CurveEditor
        initialPhases={localCurveData?.phases || defaultPhases}
        onSave={handleCurveChange}
        isTemplateMode={true}
        onApplyGlassTemplate={handleApplyGlassTemplate}
      />

      {/* Template Confirmation Button - Shows after applying glass template or if template exists */}
      {showConfirmButton && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleConfirmTemplate}
            disabled={isSavingTemplate}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            {isSavingTemplate 
              ? "Saving..." 
              : isExistingTemplate 
                ? "Update Template" 
                : "Confirm Template"
            }
          </Button>
        </div>
      )}

      {/* Show unsaved changes indicator */}
      {hasTemplateChanges && !showConfirmButton && (
        <div className="mt-6 flex justify-center">
          <div className="text-sm text-orange-600">
            • Unsaved template changes
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCurveEditor;
