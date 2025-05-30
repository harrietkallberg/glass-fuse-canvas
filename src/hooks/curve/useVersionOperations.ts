import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { Phase, calculateTotalTime } from '@/utils/curveUtils';
import { CurveVersion } from '@/types/curve';

export const useVersionOperations = () => {
  const { user } = useAuth();

  // Convert semantic version to number for database storage
  const semanticToNumber = (semanticVersion: string): number => {
    const parts = semanticVersion.split('.');
    const major = parseInt(parts[0]) || 0;
    const minor = parseInt(parts[1]) || 0;
    const patch = parseInt(parts[2]) || 0;
    const subPatch = parseInt(parts[3]) || 0;
    return major * 1000000 + minor * 10000 + patch * 100 + subPatch;
  };

  // Convert number back to semantic version
  const numberToSemantic = (versionNumber: number): string => {
    const major = Math.floor(versionNumber / 1000000);
    const minor = Math.floor((versionNumber % 1000000) / 10000);
    const patch = Math.floor((versionNumber % 10000) / 100);
    const subPatch = versionNumber % 100;
    
    if (subPatch > 0) {
      return `${major}.${minor}.${patch}.${subPatch}`;
    } else if (patch > 0) {
      return `${major}.${minor}.${patch}`;
    }
    return `${major}.${minor}`;
  };

  const saveCurveVersion = async (
    curveId: string,
    versionName: string,
    curveState: any,
    phases: Phase[]
  ) => {
    if (!user) return null;

    console.log('Starting to save curve version:', { curveId, versionName });

    const semanticVersion = versionName.replace('Version ', '');
    const numericVersion = semanticToNumber(semanticVersion);

    try {
      // First, update all existing versions to not be current
      const { error: updateError } = await supabase
        .from('curve_versions')
        .update({ is_current: false })
        .eq('curve_id', curveId);

      if (updateError) {
        console.error('Error updating existing versions:', updateError);
        return null;
      }

      console.log('Creating new version with data:', {
        curve_id: curveId,
        version_number: numericVersion,
        name: versionName,
        is_current: true,
      });

      // Create new version as current
      const { data: versionData, error: versionError } = await supabase
        .from('curve_versions')
        .insert({
          curve_id: curveId,
          version_number: numericVersion,
          name: versionName,
          is_current: true,
          selected_glass: curveState.selectedGlass,
          room_temp: curveState.roomTemp,
          glass_layers: curveState.glassLayers,
          glass_radius: curveState.glassRadius,
          firing_type: curveState.firingType,
          top_temp_minutes: curveState.topTempMinutes,
          oven_type: curveState.ovenType,
          total_time: calculateTotalTime(phases),
          notes: curveState.notes || '',
          materials: curveState.materials || '',
          tags: curveState.tags || '',
        })
        .select()
        .single();

      if (versionError) {
        console.error('Error creating version:', versionError);
        return null;
      }

      console.log('Successfully created version:', versionData);

      // Save phases
      const phasesToInsert = phases.map((phase, index) => ({
        version_id: versionData.id,
        phase_order: index,
        target_temp: phase.targetTemp,
        duration: phase.duration,
        hold_time: phase.holdTime,
      }));

      const { error: phasesError } = await supabase
        .from('curve_phases')
        .insert(phasesToInsert);

      if (phasesError) {
        console.error('Error saving phases:', phasesError);
        return null;
      }

      console.log('Successfully saved phases');
      return { ...versionData, is_current: true };
    } catch (error) {
      console.error('Error in saveCurveVersion:', error);
      return null;
    }
  };

  const loadCurveVersion = async (versionId: string) => {
    const { data: versionData, error: versionError } = await supabase
      .from('curve_versions')
      .select('*')
      .eq('id', versionId)
      .single();

    if (versionError) {
      console.error('Error loading version:', versionError);
      return null;
    }

    const { data: phasesData, error: phasesError } = await supabase
      .from('curve_phases')
      .select('*')
      .eq('version_id', versionId)
      .order('phase_order');

    if (phasesError) {
      console.error('Error loading phases:', phasesError);
      return null;
    }

    const phases: Phase[] = phasesData.map(phase => ({
      id: phase.id,
      targetTemp: phase.target_temp,
      duration: phase.duration,
      holdTime: phase.hold_time,
    }));

    return {
      version: versionData,
      phases,
    };
  };

  const getCurveVersions = async (curveId: string): Promise<CurveVersion[]> => {
    try {
      console.log('Fetching versions for curve:', curveId);
      const { data, error } = await supabase
        .from('curve_versions')
        .select('*')
        .eq('curve_id', curveId)
        .order('version_number', { ascending: true });

      if (error) {
        console.error('Error fetching versions:', error);
        return [];
      }

      console.log('Fetched versions:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getCurveVersions:', error);
      return [];
    }
  };

  return {
    saveCurveVersion,
    loadCurveVersion,
    getCurveVersions,
    numberToSemantic,
    semanticToNumber,
  };
};
