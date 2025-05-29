
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Phase, calculateTotalTime } from '@/utils/curveUtils';

export interface CurveData {
  id: string;
  title: string;
  description: string;
  is_private: boolean;
  glass_type?: string;
  oven_type?: string;
  thickness?: string;
  project_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CurveVersion {
  id: string;
  curve_id: string;
  version_number: number;
  name: string;
  is_current: boolean;
  selected_glass?: string;
  room_temp?: number;
  glass_layers?: string;
  glass_radius?: string;
  firing_type?: string;
  top_temp_minutes?: string;
  oven_type?: string;
  total_time?: number;
  notes?: string;
  materials?: string;
  tags?: string;
  created_at: string;
}

export const useCurves = () => {
  const { user } = useAuth();
  const [curves, setCurves] = useState<CurveData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's curves - only real data from database
  const fetchCurves = async () => {
    if (!user) {
      setCurves([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase
      .from('curves')
      .select('*')
      .eq('user_id', user.id) // Only fetch curves for the current user
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching curves:', error);
      setCurves([]);
    } else {
      setCurves(data || []);
    }
    setLoading(false);
  };

  // Create a new curve
  const createCurve = async (title: string, description: string = '') => {
    if (!user) return null;

    const { data: curveData, error: curveError } = await supabase
      .from('curves')
      .insert({
        user_id: user.id,
        title,
        description,
      })
      .select()
      .single();

    if (curveError) {
      console.error('Error creating curve:', curveError);
      return null;
    }

    // Create initial version with numeric versioning
    const { data: versionData, error: versionError } = await supabase
      .from('curve_versions')
      .insert({
        curve_id: curveData.id,
        version_number: 10000, // 1.0 in numeric format
        name: 'Version 1.0',
        is_current: true,
      })
      .select()
      .single();

    if (versionError) {
      console.error('Error creating initial version:', versionError);
      return null;
    }

    await fetchCurves();
    return curveData;
  };

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

  // Fixed save function with proper constraint handling
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
      // Use a transaction-like approach by creating the new version first without is_current
      console.log('Creating new version with data:', {
        curve_id: curveId,
        version_number: numericVersion,
        name: versionName,
        is_current: false, // Start with false to avoid constraint violation
      });

      // Create new version (not current initially)
      const { data: versionData, error: versionError } = await supabase
        .from('curve_versions')
        .insert({
          curve_id: curveId,
          version_number: numericVersion,
          name: versionName,
          is_current: false, // Initially false
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

      // Now update all existing versions to not be current
      const { error: updateError } = await supabase
        .from('curve_versions')
        .update({ is_current: false })
        .eq('curve_id', curveId)
        .neq('id', versionData.id);

      if (updateError) {
        console.error('Error updating existing versions:', updateError);
        return null;
      }

      // Finally, set the new version as current
      const { error: setCurrentError } = await supabase
        .from('curve_versions')
        .update({ is_current: true })
        .eq('id', versionData.id);

      if (setCurrentError) {
        console.error('Error setting version as current:', setCurrentError);
        return null;
      }

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

  // Load curve version with phases
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

  // Enhanced get versions function with better error handling
  const getCurveVersions = async (curveId: string) => {
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

  // New function to refresh versions for a specific curve
  const refetchCurveVersions = async (curveId: string) => {
    return await getCurveVersions(curveId);
  };

  // Generate semantic version number with better logic
  const getNextVersionNumber = (existingVersions: any[], isNewVersion: boolean, currentVersionId?: string) => {
    console.log('Generating next version number:', { existingVersions, isNewVersion, currentVersionId });
    
    if (existingVersions.length === 0) return "1.0";
    
    // Find current version or latest version
    const currentVersion = currentVersionId 
      ? existingVersions.find(v => v.id === currentVersionId)
      : existingVersions.find(v => v.is_current) || existingVersions[existingVersions.length - 1];
    
    if (!currentVersion) return "1.0";
    
    const currentSemantic = numberToSemantic(currentVersion.version_number);
    console.log('Current semantic version:', currentSemantic);
    
    if (isNewVersion) {
      // Create new major version
      const majorVersions = existingVersions.map(v => Math.floor(v.version_number / 1000000));
      const maxMajor = Math.max(...majorVersions);
      const nextVersion = `${maxMajor + 1}.0`;
      console.log('Next major version:', nextVersion);
      return nextVersion;
    } else {
      // Create minor version increment
      const [major, minor = "0"] = currentSemantic.split('.');
      const nextVersion = `${major}.${parseInt(minor) + 1}`;
      console.log('Next minor version:', nextVersion);
      return nextVersion;
    }
  };

  // Delete a curve and all its versions
  const deleteCurve = async (curveId: string) => {
    if (!user) return false;

    try {
      // First delete all curve phases for this curve's versions
      const { data: versions } = await supabase
        .from('curve_versions')
        .select('id')
        .eq('curve_id', curveId);

      if (versions && versions.length > 0) {
        const versionIds = versions.map(v => v.id);
        
        // Delete all phases for these versions
        const { error: phasesError } = await supabase
          .from('curve_phases')
          .delete()
          .in('version_id', versionIds);

        if (phasesError) {
          console.error('Error deleting curve phases:', phasesError);
          return false;
        }
      }

      // Delete all versions for this curve
      const { error: versionsError } = await supabase
        .from('curve_versions')
        .delete()
        .eq('curve_id', curveId);

      if (versionsError) {
        console.error('Error deleting curve versions:', versionsError);
        return false;
      }

      // Finally delete the curve itself
      const { error: curveError } = await supabase
        .from('curves')
        .delete()
        .eq('id', curveId)
        .eq('user_id', user.id); // Ensure user can only delete their own curves

      if (curveError) {
        console.error('Error deleting curve:', curveError);
        return false;
      }

      // Refresh the curves list
      await fetchCurves();
      return true;
    } catch (error) {
      console.error('Error in deleteCurve:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCurves();
    } else {
      setCurves([]);
      setLoading(false);
    }
  }, [user]);

  return {
    curves,
    loading,
    createCurve,
    deleteCurve,
    saveCurveVersion,
    loadCurveVersion,
    getCurveVersions,
    refetchCurveVersions,
    refetchCurves: fetchCurves,
    numberToSemantic,
    getNextVersionNumber,
  };
};
