import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCurveState } from "@/hooks/useCurveState";
import GlassSettings from "@/components/curve-editor/GlassSettings";
import CurveChart from "@/components/curve-editor/CurveChart";
import PhasesTable from "@/components/curve-editor/PhasesTable";
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
  const [savedTemplatePhases, setSavedTemplatePhases] = useState<Phase[]>([]);
  const [previewPhases, setPreviewPhases] = useState<Phase[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [isEditMode, setIsEditMode] = useState(false);
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
      setSavedTemplatePhases(templateCurveData.phases);
    }
  }, [templateCurveData]);

  // Fetch template data from Supabase
  const fetchTemplateFromDatabase = async () => {
    if (!curveId) return;

    try {
      const { data: templateVersion, error } = await supabase
        .from('curve_versions')
        .select('*')
        .eq('curve_id', curveId)
        .eq('version_number', 0)
        .maybeSingle();

      if (error || !templateVersion) {
        console.log('No template found in database');
        setSavedTemplatePhases([]);
        return;
      }

      // Fetch template phases with velocity
      const { data: phasesData, error: phasesError } = await supabase
        .from('curve_phases')
        .select('*')
        .eq('version_id', templateVersion.id)
        .order('phase_order');

      if (phasesError) {
        console.error('Error fetching template phases:', phasesError);
        return;
      }

      const phases: Phase[] = phasesData.map((phase: any, index) => {
        console.log(`Fetching template phase: targetTemp=${phase.target_temp}, velocity=${phase.velocity}`);
        return {
          id: (index + 1).toString(),
          targetTemp: phase.target_temp,
          duration: phase.duration,
          holdTime: phase.hold_time,
          velocity: phase.velocity || 0, // Include velocity from database
        };
      });

      const templateData = {
        phases,
        settings: {
          selectedGlass: templateVersion.selected_glass,
          roomTemp: templateVersion.room_temp,
          glassLayers: templateVersion.glass_layers,
          glassRadius: templateVersion.glass_radius,
          firingType: templateVersion.firing_type,
          topTempMinutes: templateVersion.top_temp_minutes,
          ovenType: templateVersion.oven_type,
        }
      };

      setSavedTemplatePhases(phases);
      setTemplateCurveData(templateData);
      
      // Also load settings into the curve state
      curveState.loadTemplateSettings(templateData.settings);

    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  // Fetch template on component mount
  useEffect(() => {
    fetchTemplateFromDatabase();
  }, [curveId]);

  const handleCreateTemplate = () => {
    setShowTemplateEditor(true);
    setIsEditMode(true);
  };

  const handleViewGlassTemplate = () => {
    if (savedTemplatePhases.length > 0 && !isEditMode) {
      // Just show the existing template
      setPreviewPhases(savedTemplatePhases);
      setShowPreview(true);
      toast({
        title: "Template Preview",
        description: "Viewing your saved project template.",
      });
    } else {
      // Generate new template from current settings
      const generatedPhases = curveState.generateTemplateFromSettings();
      if (generatedPhases) {
        setPreviewPhases(generatedPhases);
        setShowPreview(true);
        toast({
          title: "Template Generated",
          description: "Preview your glass template below. Click 'Confirm as Project Template' to save it.",
        });
      }
    }
  };

  const handleEditTemplate = () => {
    setIsEditMode(true);
    setShowPreview(false);
    setPreviewPhases([]);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setShowPreview(false);
    setPreviewPhases([]);
    // Reset settings to saved template settings
    if (templateCurveData?.settings) {
      curveState.loadTemplateSettings(templateCurveData.settings);
    }
  };

  const handleConfirmTemplate = async () => {
    if (!user || !curveId || previewPhases.length === 0) {
      toast({
        title: "Error",
        description: "Missing required data to save template.",
        variant: "destructive"
      });
      return;
    }

    setIsSavingTemplate(true);

    try {
      // Get current glass settings
      const currentSettings = curveState.getTemplateSettings();

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

      const phasesToInsert = previewPhases.map((phase: Phase, index: number) => {
        console.log(`Saving template phase ${index}: targetTemp=${phase.targetTemp}, velocity=${phase.velocity}`);
        return {
          version_id: templateVersion.id,
          phase_order: index,
          target_temp: phase.targetTemp,
          duration: phase.duration,
          hold_time: phase.holdTime,
          velocity: phase.velocity || 0, // Save velocity to database
        };
      });

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

      // Update the template data state and saved phases
      const updatedTemplateData = {
        phases: previewPhases,
        settings: currentSettings
      };

      setTemplateCurveData(updatedTemplateData);
      setSavedTemplatePhases(previewPhases);
      setShowPreview(false);
      setPreviewPhases([]);
      setIsEditMode(false);
      
      // Re-fetch the template data to ensure consistency
      await fetchTemplateFromDatabase();
      
      if (onTemplateConfirmed) {
        onTemplateConfirmed();
      }
      
      toast({
        title: "Project Template Saved!",
        description: "Your project template has been saved and will be used as the baseline for all versions.",
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

  // Check if template exists and we're not in edit mode
  const hasTemplate = savedTemplatePhases.length > 0;
  const isGlassSettingsDisabled = hasTemplate && !isEditMode;

  // Determine button text and action
  const getButtonText = () => {
    if (!hasTemplate) return "View Glass Template";
    if (isEditMode) return "View Glass Template";
    return "Edit Project Template";
  };

  const getButtonAction = () => {
    if (!hasTemplate || isEditMode) return handleViewGlassTemplate;
    return handleEditTemplate;
  };

  // If no template exists and user hasn't chosen to create one
  if (!templateCurveData?.phases && !showTemplateEditor) {
    return (
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Project Template</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            No Template
          </span>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-600 mb-6">
            No project template has been created yet. Create a template to define the base firing curve for this project.
          </div>
          
          <Button 
            onClick={handleCreateTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Create Template
          </Button>
        </div>
      </div>
    );
  }

  // Show the template configuration interface
  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Project Template</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Baseline Curve
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-6">
        Configure your glass parameters and firing curve template. This serves as the foundation for all experiments.
      </div>
      
      <div className="space-y-6">
        {/* Glass Settings Configuration */}
        <div className="relative">
          {isGlassSettingsDisabled && (
            <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <p className="font-medium">Template is locked</p>
                <p className="text-sm">Click "Edit Project Template" to modify settings</p>
              </div>
            </div>
          )}
          
          <GlassSettings 
            glassData={curveState.glassData}
            selectedGlass={curveState.selectedGlass}
            setSelectedGlass={isGlassSettingsDisabled ? () => {} : curveState.setSelectedGlass}
            roomTemp={curveState.roomTemp}
            setRoomTemp={isGlassSettingsDisabled ? () => {} : curveState.setRoomTemp}
            glassLayers={curveState.glassLayers}
            setGlassLayers={isGlassSettingsDisabled ? () => {} : curveState.setGlassLayers}
            glassRadius={curveState.glassRadius}
            setGlassRadius={isGlassSettingsDisabled ? () => {} : curveState.setGlassRadius}
            firingType={curveState.firingType}
            setFiringType={isGlassSettingsDisabled ? () => {} : curveState.setFiringType}
            topTempMinutes={curveState.topTempMinutes}
            setTopTempMinutes={isGlassSettingsDisabled ? () => {} : curveState.setTopTempMinutes}
            viewGlassTemplate={getButtonAction()}
            ovenType={curveState.ovenType}
            setOvenType={isGlassSettingsDisabled ? () => {} : curveState.setOvenType}
            buttonText={getButtonText()}
          />
        </div>
        
        {/* Action buttons when in edit mode */}
        {isEditMode && hasTemplate && (
          <div className="flex gap-3 justify-end">
            <Button 
              onClick={handleCancelEdit}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        )}
        
        {/* Template Preview - Show when user clicks "Generate Template" */}
        {showPreview && previewPhases.length > 0 && (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Template Preview</h4>
              
              {/* Visual Chart or Table View */}
              <div className="bg-white/60 p-4 rounded-xl mb-6">
                {viewMode === 'table' ? (
                  <PhasesTable 
                    phases={previewPhases}
                    updatePhase={() => {}} // Read-only preview
                    addPhase={() => {}} // Read-only preview
                    removePhase={() => {}} // Read-only preview
                    handleSave={() => {}} // Read-only preview
                    selectedGlassInfo={curveState.selectedGlassInfo}
                    showSlideSelector={true}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    roomTemp={curveState.roomTemp}
                  />
                ) : (
                  <>
                    <PhasesTable 
                      phases={[]} // Empty to just show the selector
                      updatePhase={() => {}}
                      addPhase={() => {}}
                      removePhase={() => {}}
                      handleSave={() => {}}
                      showSlideSelector={true}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                    <CurveChart 
                      phases={previewPhases}
                      roomTemp={curveState.roomTemp}
                    />
                  </>
                )}
              </div>
              
              {/* Confirm Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleConfirmTemplate}
                  disabled={isSavingTemplate}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  {isSavingTemplate ? "Saving..." : "Confirm as Project Template"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Saved Template Display - Show saved template if it exists and not previewing */}
        {savedTemplatePhases.length > 0 && !showPreview && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Saved Template Curve</h4>
            
            <div className="bg-white/60 p-4 rounded-xl">
              {viewMode === 'table' ? (
                <PhasesTable 
                  phases={savedTemplatePhases}
                  updatePhase={() => {}} // Read-only for saved template
                  addPhase={() => {}} // Read-only for saved template
                  removePhase={() => {}} // Read-only for saved template
                  handleSave={() => {}} // Read-only for saved template
                  selectedGlassInfo={curveState.selectedGlassInfo}
                  showSlideSelector={true}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  roomTemp={curveState.roomTemp}
                />
              ) : (
                <>
                  <PhasesTable 
                    phases={[]} // Empty to just show the selector
                    updatePhase={() => {}}
                    addPhase={() => {}}
                    removePhase={() => {}}
                    handleSave={() => {}}
                    showSlideSelector={true}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                  <CurveChart 
                    phases={savedTemplatePhases}
                    roomTemp={curveState.roomTemp}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCurveEditor;
