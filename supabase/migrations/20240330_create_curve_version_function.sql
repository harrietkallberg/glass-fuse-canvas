-- Create a function to handle curve version creation atomically
CREATE OR REPLACE FUNCTION create_curve_version(
  p_curve_id UUID,
  p_version_number INTEGER,
  p_name TEXT,
  p_selected_glass TEXT,
  p_room_temp INTEGER,
  p_glass_layers TEXT,
  p_glass_radius TEXT,
  p_firing_type TEXT,
  p_top_temp_minutes TEXT,
  p_oven_type TEXT,
  p_total_time INTEGER,
  p_notes TEXT,
  p_materials TEXT,
  p_tags TEXT
) RETURNS curve_versions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_version curve_versions;
BEGIN
  -- Start transaction
  BEGIN
    -- First, update all existing versions to not be current
    UPDATE curve_versions
    SET is_current = false
    WHERE curve_id = p_curve_id;

    -- Then create the new version as current
    INSERT INTO curve_versions (
      curve_id,
      version_number,
      name,
      is_current,
      selected_glass,
      room_temp,
      glass_layers,
      glass_radius,
      firing_type,
      top_temp_minutes,
      oven_type,
      total_time,
      notes,
      materials,
      tags
    ) VALUES (
      p_curve_id,
      p_version_number,
      p_name,
      true,
      p_selected_glass,
      p_room_temp,
      p_glass_layers,
      p_glass_radius,
      p_firing_type,
      p_top_temp_minutes,
      p_oven_type,
      p_total_time,
      p_notes,
      p_materials,
      p_tags
    )
    RETURNING * INTO v_new_version;

    RETURN v_new_version;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback will happen automatically
      RAISE EXCEPTION 'Failed to create version: %', SQLERRM;
  END;
END;
$$; 