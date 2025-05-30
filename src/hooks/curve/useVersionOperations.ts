import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { Phase, calculateTotalTime } from '@/utils/curveUtils';
import { CurveVersion } from '@/types/curve';

export const useVersionOperations = () => {
  const { user } = useAuth();

  // Convert semantic version to number for database storage
  const semanticToNumber = (semanticVersion: string): number => {
    // Handle template version
    if (semanticVersion === "Template" || semanticVersion === "0.0") {
      return 0;
    }
    
    // Handle decimal versions like "0.1", "1.2", etc.
    const numericVersion = parseFloat(semanticVersion);
    if (!isNaN(numericVersion)) {
      // Multiply by 10 to store decimals as integers (0.1 -> 1, 1.2 -> 12)
      return Math.round(numericVersion * 10);
    }
    
    const parts = semanticVersion.split('.');
    const major = parseInt(parts[0]) || 1;
    const minor = parseInt(parts[1]) || 0;
    const patch = parseInt(parts[2]) || 0;
    const subPatch = parseInt(parts[3]) || 0;
    
    // Use a smaller multiplier to avoid huge numbers
    return major * 10000 + minor * 100 + patch * 10 + subPatch;
  };

  // Convert number back to semantic version
  const numberToSemantic = (versionNumber: number): string => {
    // Handle template version
    if (versionNumber === 0) {
      return "Template";
    }
    
    // Handle decimal versions (1 -> 0.1, 12 -> 1.2)
    if (versionNumber < 100) {
      const decimal = versionNumber / 10;
      return decimal.toString();
    }
    
    const major = Math.floor(versionNumber / 10000);
    const minor = Math.floor((versionNumber % 10000) / 100);
    const patch = Math.floor((versionNumber % 100) / 10);
    const subPatch = versionNumber % 10;
    
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
    if (!user) {
      console.error('No user found when trying to save curve version');
      return null;
    }

    console.log('Starting to save curve version:', { curveId, versionName, curveState, phases });

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
        throw new Error(`Failed to update existing versions: ${updateError.message}`);
      }

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
        throw new Error(`Failed to create version: ${versionError.message}`);
      }

      console.log('Successfully created version:', versionData);

      // Save phases with velocity values
      if (phases && phases.length > 0) {
        const phasesToInsert = phases.map((phase, index) => {
          // Ensure all values are numbers and have default values
          const targetTemp = Number(phase.targetTemp) || 0;
          const duration = Number(phase.duration) || 0;
          const holdTime = Number(phase.holdTime) || 0;
          const velocity = Number(phase.velocity) || 0;

          console.log(`Saving phase ${index}: targetTemp=${targetTemp}, duration=${duration}, holdTime=${holdTime}, velocity=${velocity}`);
          
          return {
            version_id: versionData.id,
            phase_order: index,
            target_temp: targetTemp,
            duration: duration,
            hold_time: holdTime,
            velocity: velocity,
          };
        });

        console.log('Inserting phases:', phasesToInsert);

        const { error: phasesError } = await supabase
          .from('curve_phases')
          .insert(phasesToInsert);

        if (phasesError) {
          console.error('Error saving phases:', phasesError);
          throw new Error(`Failed to save phases: ${phasesError.message}`);
        }

        console.log('Successfully saved phases with velocities');
      } else {
        console.warn('No phases to save for the new version');
      }
      
      return { ...versionData, is_current: true };
    } catch (error) {
      console.error('Error in saveCurveVersion:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  const loadCurveVersion = async (versionId: string) => {
    try {
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

      const phases: Phase[] = phasesData.map((phase: any) => {
        // Ensure all required fields are present and properly typed
        const targetTemp = typeof phase.target_temp === 'number' ? phase.target_temp : 0;
        const duration = typeof phase.duration === 'number' ? phase.duration : 0;
        const holdTime = typeof phase.hold_time === 'number' ? phase.hold_time : 0;
        const velocity = typeof phase.velocity === 'number' ? phase.velocity : 0;

        console.log(`Loading phase from DB: targetTemp=${targetTemp}, duration=${duration}, holdTime=${holdTime}, velocity=${velocity}`);
        
        return {
          id: phase.id,
          targetTemp,
          duration,
          holdTime,
          velocity,
        };
      });

      return {
        version: versionData,
        phases,
      };
    } catch (error) {
      console.error('Error in loadCurveVersion:', error);
      return null;
    }
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

      console.log('Fetched versions from database:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getCurveVersions:', error);
      return [];
    }
  };

  // New function to clean up unwanted versions
  const deleteUnwantedVersions = async (curveId: string) => {
    try {
      // Delete any versions that are not the template (version_number = 0)
      // and were created automatically
      const { error } = await supabase
        .from('curve_versions')
        .delete()
        .eq('curve_id', curveId)
        .neq('version_number', 0)
        .is('name', null); // Delete versions without proper names

      if (error) {
        console.error('Error deleting unwanted versions:', error);
      } else {
        console.log('Cleaned up unwanted versions for curve:', curveId);
      }
    } catch (error) {
      console.error('Error in deleteUnwantedVersions:', error);
    }
  };

  const deleteVersion = async (versionId: string) => {
    if (!user) {
      console.error('No user found when trying to delete version');
      return false;
    }

    try {
      console.log('Starting version deletion for version:', versionId);

      // First get the version to check if it exists and get its curve_id
      const { data: versionData, error: versionCheckError } = await supabase
        .from('curve_versions')
        .select('curve_id, version_number')
        .eq('id', versionId)
        .single();

      if (versionCheckError) {
        console.error('Error checking version:', versionCheckError);
        throw new Error(`Failed to verify version: ${versionCheckError.message}`);
      }

      if (!versionData) {
        console.error('Version not found:', versionId);
        throw new Error('Version not found');
      }

      // Don't allow deleting template version
      if (versionData.version_number === 0 || String(versionData.version_number) === "Template") {
        console.error('Attempted to delete template version');
        throw new Error('Cannot delete template version');
      }

      // Start a transaction by using a single RPC call
      const { error: transactionError } = await supabase.rpc('delete_curve_version', {
        p_version_id: versionId
      });

      if (transactionError) {
        console.error('Error in delete transaction:', transactionError);
        throw new Error(`Failed to delete version: ${transactionError.message}`);
      }

      console.log('Successfully deleted version:', versionId);
      return true;
    } catch (error) {
      console.error('Error in deleteVersion:', error);
      throw error;
    }
  };

  return {
    saveCurveVersion,
    loadCurveVersion,
    getCurveVersions,
    deleteUnwantedVersions,
    deleteVersion,
    numberToSemantic,
    semanticToNumber,
  };
};
