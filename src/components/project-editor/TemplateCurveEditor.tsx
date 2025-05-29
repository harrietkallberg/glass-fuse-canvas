
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

// Default template settings
const defaultSettings = {
  selectedGlass: '',
  roomTemp: 20,
  glassLayers: '1',
  glassRadius: '10',
  firingType: 'f',
  topTempMinutes: '10',
  ovenType: 't',
};

const TemplateCurveEditor = ({
  isNewCurve,
  templateCurveData,
  setTemplateCurveData,
  curveId,
  onTemplateConfirmed,
  projectTitle = "",
  projectDescription = ""
}: TemplateCurveEditorProps) => {
  const [localCurveData, setLocalCurveData] = useState(null);
  const [hasTemplateChanges, setHasTemplateChanges] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [originalPhases, setOriginalPhases] = useState<Phase[]>([]);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [hasExistingTemplate, setHasExistingTemplate] = useState(false);
  const [templateConfirmedInSession, setTemplateConfirmedInSession] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const temperatureUnit = "celsius";

  // Load template data directly from database when component mounts
  useEffect(() => {
    const loadTemplateData = async () => {
      if (!curveId || !user) {
        // If no curve ID, set up default state for new template
        const defaultCurveData = {
          phases: defaultPhases,
          temperatureUnit,
          settings: defaultSettings
        };
        setLocalCurveData(defaultCurveData);
        setOriginalPhases([]);
        setHasTemplateChanges(false); // Start with no changes for new template
        setHasExistingTemplate(false);
        setTemplateConfirmedInSession(false);
        setShowConfirmButton(true); // Show button to create initial template
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }

      console.log('Loading template data for curve ID:', curveId);
      setIsLoading(true);

      try {
        // Get the template version (version 0)
        const { data: templateVersion, error: versionError } = await supabase
          .from('curve_versions')
          .select('*')
          .eq('curve_id', curveId)
          .eq('version_number', 0)
          .maybeSingle();

        if (versionError && versionError.code !== 'PGRST116') {
          console.error('Error fetching template version:', versionError);
          setIsLoading(false);
          return;
        }

        if (templateVersion) {
          console.log('Found template version:', templateVersion);
          
          // Get template phases
          const { data: phases, error: phasesError } = await supabase
            .from('curve_phases')
            .select('*')
            .eq('version_id', templateVersion.id)
            .order('phase_order');

          if (phasesError) {
            console.error('Error fetching template phases:', phasesError);
            setIsLoading(false);
            return;
          }

          // Convert database phases to our format
          const templatePhases = phases?.map(phase => ({
            id: phase.id,
            targetTemp: phase.target_temp,
            duration: phase.duration,
            holdTime: phase.hold_time
          })) || [];

          // Create complete template data with settings
          const completeTemplateData = {
            phases: templatePhases,
            settings: {
              selectedGlass: templateVersion.selected_glass || '',
              roomTemp: templateVersion.room_temp || 20,
              glassLayers: templateVersion.glass_layers || '1',
              glassRadius: templateVersion.glass_radius || '10',
              firingType: templateVersion.firing_type || 'f',
              topTempMinutes: templateVersion.top_temp_minutes || '10',
              ovenType: templateVersion.oven_type || 't',
            }
          };

          console.log('Loaded complete template data:', completeTemplateData);
          
          // Set the complete template data
          setTemplateCurveData(completeTemplateData);
          setLocalCurveData({
            ...completeTemplateData,
            temperatureUnit
          });
          setOriginalPhases([...templatePhases]);
          setHasExistingTemplate(true);
          setTemplateConfirmedInSession(true);
          setHasTemplateChanges(false);
          setShowConfirmButton(false);
        } else {
          console.log('No template version found, setting up default for existing project');
          // No template exists for this existing project, set up default
          const defaultCurveData = {
            phases: defaultPhases,
            temperatureUnit,
            settings: defaultSettings
          };
          setLocalCurveData(defaultCurveData);
          setOriginalPhases([]);
          setHasTemplateChanges(false); // Start with no changes
          setHasExistingTemplate(false);
          setTemplateConfirmedInSession(false);
          setShowConfirmButton(true); // Show button to create template
        }
      } catch (error) {
        console.error('Error loading template data:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadTemplateData();
  }, [curveId, user, setTemplateCurveData]);

  // Update local state when templateCurveData changes from parent
  useEffect(() => {
    if (isInitialized && templateCurveData && localCurveData) {
      console.log('Parent templateCurveData updated:', templateCurveData);
      
      // Only update if the data is different
      const currentData = JSON.stringify(localCurveData);
      const newData = JSON.stringify({
        ...templateCurveData,
        temperatureUnit
      });
      
      if (currentData !== newData) {
        setLocalCurveData({
          ...templateCurveData,
          temperatureUnit
        });
      }
    }
  }, [templateCurveData, isInitialized, localCurveData, temperatureUnit]);

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
    console.log('Curve changed, phases:', phases);
    const curveData = {
      ...localCurveData,
      phases,
      temperatureUnit,
    };
    
    setLocalCurveData(curveData);
    
    // For new templates or existing templates, mark as having changes
    if (!hasExistingTemplate || originalPhases.length === 0) {
      // For new templates, any change should be saved
      setHasTemplateChanges(true);
      setShowConfirmButton(true);
    } else {
      // For existing templates, check if phases have actually changed from original
      const hasChanges = phasesHaveChanged(phases, originalPhases);
      setHasTemplateChanges(hasChanges);
      setShowConfirmButton(hasChanges);
    }
  };

  const handleApplyGlassTemplate = () => {
    console.log('Glass template applied');
    // Mark as having changes and show confirm button
    setHasTemplateChanges(true);
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

    console.log('Confirming template with data:', localCurveData);
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

      // Create the updated template data with settings
      const updatedTemplateData = {
        phases: localCurveData.phases,
        settings: {
          selectedGlass: localCurveData.settings?.selectedGlass,
          roomTemp: localCurveData.settings?.roomTemp || 20,
          glassLayers: localCurveData.settings?.glassLayers || "1",
          glassRadius: localCurveData.settings?.glassRadius || "10",
          firingType: localCurveData.settings?.firingType || "f",
          topTempMinutes: localCurveData.settings?.topTempMinutes || "10",
          ovenType: localCurveData.settings?.ovenType || "t",
        }
      };

      console.log('Template saved successfully, updating state with:', updatedTemplateData);
      
      // Update parent state with confirmed template data
      setTemplateCurveData(updatedTemplateData);
      
      // Update local state to reflect the confirmed template
      setLocalCurveData({ ...updatedTemplateData, temperatureUnit });
      setOriginalPhases([...localCurveData.phases]);
      setHasTemplateChanges(false);
      setTemplateConfirmedInSession(true);
      setHasExistingTemplate(true);
      setShowConfirmButton(false);
      
      if (onTemplateConfirmed) {
        onTemplateConfirmed();
      }
      
      // Show appropriate success message
      const successMessage = hasExistingTemplate && templateConfirmedInSession
        ? "Template has been updated!"
        : "Template created successfully!";
      
      const successDescription = hasExistingTemplate && templateConfirmedInSession
        ? "Project template has been updated and will be used for dashboard display."
        : "Project template has been created and will be used for dashboard display.";
      
      toast({
        title: successMessage,
        description: successDescription,
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

  console.log('Rendering TemplateCurveEditor with:', {
    hasExistingTemplate,
    templateConfirmedInSession,
    showConfirmButton,
    hasTemplateChanges,
    localCurveData: localCurveData?.phases?.length,
    localSettings: localCurveData?.settings,
    isLoading
  });

  // Show loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Loading template...</div>
        </div>
      </div>
    );
  }

  // Don't render if we don't have local curve data
  if (!localCurveData) {
    return (
      <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Initializing template...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Template Curve Configuration</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Project Template
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-6">
        {hasExistingTemplate && templateConfirmedInSession
          ? "Modify your project template. Changes will update the template used for all versions across the project."
          : "Configure your base firing curve template. This will serve as the starting point for all versions across the project."
        }
      </div>
      
      <CurveEditor
        initialPhases={localCurveData.phases || defaultPhases}
        onSave={handleCurveChange}
        isTemplateMode={true}
        onApplyGlassTemplate={handleApplyGlassTemplate}
        savedSettings={localCurveData.settings}
      />

      {/* Template Confirmation Button */}
      {showConfirmButton && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleConfirmTemplate}
            disabled={isSavingTemplate}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            {isSavingTemplate 
              ? "Saving..." 
              : hasExistingTemplate
                ? "Update Template" 
                : "Create Template"
            }
          </Button>
        </div>
      )}

      {/* Status indicators */}
      {!hasExistingTemplate && !showConfirmButton && (
        <div className="mt-6 flex justify-center">
          <div className="text-sm text-blue-600">
            • Ready to create template - make changes above and save
          </div>
        </div>
      )}

      {hasExistingTemplate && templateConfirmedInSession && !showConfirmButton && (
        <div className="mt-6 flex justify-center">
          <div className="text-sm text-green-600">
            ✓ Template is configured and saved
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCurveEditor;
