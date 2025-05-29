
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCurveState } from "@/hooks/useCurveState";
import GlassSettings from "@/components/curve-editor/GlassSettings";
import CurveChart from "@/components/curve-editor/CurveChart";
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { user } = useAuth();

  // Initialize curve state - if template exists, use it, otherwise use empty
  const curveState = useCurveState({ 
    initialPhases: templateCurveData?.phases || [],
    isTemplateMode: true 
  });

  // Load existing template settings when component mounts
  useEffect(() => {
    if (templateCurveData?.settings) {
      curveState.loadTemplateSettings(templateCurveData.settings);
    }
  }, [templateCurveData]);

  // Show template editor if template exists
  useEffect(() => {
    if (templateCurveData?.phases && templateCurveData.phases.length > 0) {
      setShowTemplateEditor(true);
    }
  }, [templateCurveData]);

  const handleCreateTemplate = () => {
    setShowTemplateEditor(true);
    setHasUnsavedChanges(false);
  };

  const handleGenerateFromSettings = () => {
    const generatedPhases = curveState.generateTemplateFromSettings();
    if (generatedPhases) {
      setHasUnsavedChanges(true);
      toast({
        title: "Template Generated",
        description: "Master recipe created from your glass settings. Click 'Save Template' to confirm.",
      });
    }
  };

  const handleSettingsChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleSaveTemplate = async () => {
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
      // Get current glass settings and phases
      const currentSettings = curveState.getTemplateSettings();
      const currentPhases = curveState.phases;

      if (!currentPhases || currentPhases.length === 0) {
        toast({
          title: "Error",
          description: "Please generate template phases before saving.",
          variant: "destructive"
        });
        setIsSavingTemplate(false);
        return;
      }

      // Get or create the template version (version 0)
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
        setIsSavingTemplate(false);
        return;
      }

      if (!templateVersion) {
        // Create new template version
        const { data: newTemplateVersion, error: createError } = await supabase
          .from('curve_versions')
          .insert({
            curve_id: curveId,
            version_number: 0,
            name: 'Template',
            is_current: false,
            selected_glass: currentSettings.selectedGlass,
            room_temp: currentSettings.roomTemp,
            glass_layers: currentSettings.glassLayers,
            glass_radius: currentSettings.glassRadius,
            firing_type: currentSettings.firingType,
            top_temp_minutes: currentSettings.topTempMinutes,
            oven_type: currentSettings.ovenType,
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
          setIsSavingTemplate(false);
          return;
        }

        templateVersion = newTemplateVersion;
      } else {
        // Update existing template version
        const { error: updateError } = await supabase
          .from('curve_versions')
          .update({
            selected_glass: currentSettings.selectedGlass,
            room_temp: currentSettings.roomTemp,
            glass_layers: currentSettings.glassLayers,
            glass_radius: currentSettings.glassRadius,
            firing_type: currentSettings.firingType,
            top_temp_minutes: currentSettings.topTempMinutes,
            oven_type: currentSettings.ovenType,
          })
          .eq('id', templateVersion.id);

        if (updateError) {
          console.error('Error updating template version:', updateError);
          toast({
            title: "Error",
            description: "Failed to update project template",
            variant: "destructive"
          });
          setIsSavingTemplate(false);
          return;
        }
      }

      // Delete existing template phases and save new ones
      await supabase
        .from('curve_phases')
        .delete()
        .eq('version_id', templateVersion.id);

      const phasesToInsert = currentPhases.map((phase: Phase, index: number) => ({
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
          description: "Failed to save template phases",
          variant: "destructive"
        });
        setIsSavingTemplate(false);
        return;
      }

      // Update the template data state
      const updatedTemplateData = {
        phases: currentPhases,
        settings: currentSettings
      };

      setTemplateCurveData(updatedTemplateData);
      setHasUnsavedChanges(false);
      
      if (onTemplateConfirmed) {
        onTemplateConfirmed();
      }
      
      toast({
        title: "Master Recipe Saved!",
        description: "Your project template has been saved successfully.",
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

  // If no template exists and user hasn't chosen to create one
  if (!templateCurveData?.phases && !showTemplateEditor) {
    return (
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Master Recipe (Template)</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            No Template
          </span>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-600 mb-6">
            No master recipe has been created yet. Create a template to define the base firing curve for this project.
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

  // Show the template configuration interface
  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Master Recipe (Template)</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Project Template
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-6">
        Configure your glass parameters and master firing curve. This serves as the foundation for all experiments (versions).
      </div>
      
      <div className="space-y-6">
        {/* Glass Settings Configuration */}
        <GlassSettings 
          glassData={curveState.glassData}
          selectedGlass={curveState.selectedGlass}
          setSelectedGlass={(value) => {
            curveState.setSelectedGlass(value);
            handleSettingsChange();
          }}
          roomTemp={curveState.roomTemp}
          setRoomTemp={(value) => {
            curveState.setRoomTemp(value);
            handleSettingsChange();
          }}
          glassLayers={curveState.glassLayers}
          setGlassLayers={(value) => {
            curveState.setGlassLayers(value);
            handleSettingsChange();
          }}
          glassRadius={curveState.glassRadius}
          setGlassRadius={(value) => {
            curveState.setGlassRadius(value);
            handleSettingsChange();
          }}
          firingType={curveState.firingType}
          setFiringType={(value) => {
            curveState.setFiringType(value);
            handleSettingsChange();
          }}
          topTempMinutes={curveState.topTempMinutes}
          setTopTempMinutes={(value) => {
            curveState.setTopTempMinutes(value);
            handleSettingsChange();
          }}
          applyGlassTemplate={handleGenerateFromSettings}
          ovenType={curveState.ovenType}
          setOvenType={(value) => {
            curveState.setOvenType(value);
            handleSettingsChange();
          }}
        />
        
        {/* Template Curve Display */}
        {curveState.phases.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Template Curve Preview</h4>
            <CurveChart 
              phases={curveState.phases}
              roomTemp={curveState.roomTemp}
            />
          </div>
        )}
        
        {/* Save Button */}
        {hasUnsavedChanges && (
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSaveTemplate}
              disabled={isSavingTemplate || curveState.phases.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              {isSavingTemplate ? "Saving..." : "Save Template"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCurveEditor;
