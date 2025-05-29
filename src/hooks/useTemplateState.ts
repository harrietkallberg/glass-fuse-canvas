
import { useState, useEffect } from 'react';
import { Phase } from '@/utils/curveUtils';
import { supabase } from '@/integrations/supabase/client';

export interface TemplateSettings {
  selectedGlass: string;
  roomTemp: number;
  glassLayers: string;
  glassRadius: string;
  firingType: string;
  topTempMinutes: string;
  ovenType: string;
}

interface UseTemplateStateProps {
  curveId?: string;
  initialTemplate?: {
    phases: Phase[];
    settings: TemplateSettings;
  };
}

export const useTemplateState = ({ curveId, initialTemplate }: UseTemplateStateProps) => {
  const [templatePhases, setTemplatePhases] = useState<Phase[]>(
    initialTemplate?.phases || []
  );
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(
    initialTemplate?.settings || {
      selectedGlass: 'Bullseye',
      roomTemp: 20,
      glassLayers: '1',
      glassRadius: '10',
      firingType: 'f',
      topTempMinutes: '10',
      ovenType: 't'
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  // Save template to the main curve record
  const saveTemplate = async (phases: Phase[], settings: TemplateSettings) => {
    if (!curveId) return false;

    setIsLoading(true);
    try {
      // Update the main curve record with template data
      const { error } = await supabase
        .from('curves')
        .update({
          glass_type: settings.selectedGlass,
          oven_type: settings.ovenType,
          thickness: `${settings.glassLayers} layers`,
          project_type: settings.firingType === 'f' ? 'Full Fuse' : 'Slump',
          updated_at: new Date().toISOString()
        })
        .eq('id', curveId);

      if (error) {
        console.error('Error saving template:', error);
        return false;
      }

      // Store template in local state
      setTemplatePhases(phases);
      setTemplateSettings(settings);
      
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load template from existing data
  const loadTemplate = async () => {
    if (!curveId) return;

    setIsLoading(true);
    try {
      // For now, use the initial template data provided
      // In a future enhancement, we could store template phases separately
      if (initialTemplate) {
        setTemplatePhases(initialTemplate.phases);
        setTemplateSettings(initialTemplate.settings);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (curveId && !templatePhases.length) {
      loadTemplate();
    }
  }, [curveId]);

  return {
    templatePhases,
    templateSettings,
    setTemplatePhases,
    setTemplateSettings,
    saveTemplate,
    isLoading
  };
};
