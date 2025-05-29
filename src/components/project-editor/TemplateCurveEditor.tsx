
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const { user } = useAuth();

  // Show template editor if template exists or user wants to create one
  useEffect(() => {
    if (templateCurveData?.phases && templateCurveData.phases.length > 0) {
      setShowTemplateEditor(true);
    }
  }, [templateCurveData]);

  const handleCreateTemplate = () => {
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = async (phases: Phase[]) => {
    if (!user || !curveId) {
      toast({
        title: "Error",
        description: "Missing required data to save template.",
        variant: "destructive"
      });
      return;
    }

    setIsSavingTemplate(true);

    try {
      // Get the template version (version 0) or create it if it doesn't exist
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

      // Get current glass settings from the curve editor
      const currentSettings = templateCurveData?.settings || {};

      if (!templateVersion) {
        // Create template version
        const { data: newTemplateVersion, error: createError } = await supabase
          .from('curve_versions')
          .insert({
            curve_id: curveId,
            version_number: 0,
            name: 'Template',
            is_current: false,
            selected_glass: currentSettings.selectedGlass,
            room_temp: currentSettings.roomTemp || 20,
            glass_layers: currentSettings.glassLayers || "1",
            glass_radius: currentSettings.glassRadius || "10",
            firing_type: currentSettings.firingType || "f",
            top_temp_minutes: currentSettings.topTempMinutes || "10",
            oven_type: currentSettings.ovenType || "t",
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
        // Update existing template version
        const { error: updateError } = await supabase
          .from('curve_versions')
          .update({
            selected_glass: currentSettings.selectedGlass,
            room_temp: currentSettings.roomTemp || 20,
            glass_layers: currentSettings.glassLayers || "1",
            glass_radius: currentSettings.glassRadius || "10",
            firing_type: currentSettings.firingType || "f",
            top_temp_minutes: currentSettings.topTempMinutes || "10",
            oven_type: currentSettings.ovenType || "t",
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
      const phasesToInsert = phases.map((phase: Phase, index: number) => ({
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

      // Update the template data with the new information
      const updatedTemplateData = {
        phases: phases,
        settings: {
          selectedGlass: currentSettings.selectedGlass,
          roomTemp: currentSettings.roomTemp || 20,
          glassLayers: currentSettings.glassLayers || "1",
          glassRadius: currentSettings.glassRadius || "10",
          firingType: currentSettings.firingType || "f",
          topTempMinutes: currentSettings.topTempMinutes || "10",
          ovenType: currentSettings.ovenType || "t",
        }
      };

      setTemplateCurveData(updatedTemplateData);
      
      if (onTemplateConfirmed) {
        onTemplateConfirmed();
      }
      
      toast({
        title: "Template saved!",
        description: "Project template has been saved successfully.",
      });

    } catch (error) {
      console.error('Error saving project template:', error);
      toast({
        title: "Error",
        description: "Failed to save project template",
        variant: "destructive"
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleApplyGlassTemplate = () => {
    // This will trigger when the user applies glass settings
    console.log('Glass template applied');
  };

  // If no template exists and user hasn't chosen to create one, show the add button
  if (!templateCurveData?.phases && !showTemplateEditor) {
    return (
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Template Curve Configuration</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            No Template
          </span>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-600 mb-6">
            No project template has been created yet. Create a template to set the default firing curve and glass settings for this project.
          </div>
          
          <Button 
            onClick={handleCreateTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Add New Template
          </Button>
        </div>
      </div>
    );
  }

  // Show the template editor
  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Template Curve Configuration</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Project Template
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-6">
        Configure your base firing curve template and glass settings. This will serve as the default for all versions in this project.
      </div>
      
      <CurveEditor
        initialPhases={templateCurveData?.phases || defaultPhases}
        onSave={handleSaveTemplate}
        isTemplateMode={true}
        onApplyGlassTemplate={handleApplyGlassTemplate}
      />
    </div>
  );
};

export default TemplateCurveEditor;
